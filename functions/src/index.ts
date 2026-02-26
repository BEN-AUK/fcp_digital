import * as express from "express";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { VertexAI } from "@google-cloud/vertexai";
import type {
  AiTaskDoc,
  ProcessImageRequestBody,
  ProcessImageResponse,
} from "./config";

admin.initializeApp();

const FIRESTORE_PATH = "systemConfig/ai_tasks/tasks";
const DEFAULT_LOCATION = "us-central1";
/** Function timeout (deploy-time). config.timeout in Firestore is per-task and can be used for Vertex request timeout when SDK supports it. */
const DEFAULT_FUNCTION_TIMEOUT_SEC = 120;
const MEMORY = "512MiB";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function sendCors(
  res: express.Response,
  status: number,
  body: ProcessImageResponse | null
): void {
  res.set(corsHeaders);
  res.status(status);
  if (body !== null) {
    res.json(body);
  } else {
    res.send();
  }
}

function parseBody(raw: string): ProcessImageRequestBody | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "taskId" in parsed &&
      "base64Image" in parsed &&
      typeof (parsed as ProcessImageRequestBody).taskId === "string" &&
      typeof (parsed as ProcessImageRequestBody).base64Image === "string"
    ) {
      return parsed as ProcessImageRequestBody;
    }
  } catch {
    // ignore
  }
  return null;
}

async function getTaskConfig(taskId: string): Promise<AiTaskDoc | null> {
  const db = admin.firestore();
  const ref = db.collection("systemConfig").doc("ai_tasks").collection("tasks").doc(taskId);
  const snap = await ref.get();
  if (!snap.exists) {
    return null;
  }
  return snap.data() as AiTaskDoc;
}

export const processImageWithAI = onRequest(
  {
    cors: true,
    timeoutSeconds: DEFAULT_FUNCTION_TIMEOUT_SEC,
    memory: MEMORY,
  },
  async (req, res) => {
    if (req.method === "OPTIONS") {
      sendCors(res, 204, null);
      return;
    }

    if (req.method !== "POST") {
      sendCors(res, 405, {
        success: false,
        error: { code: "METHOD_NOT_ALLOWED", message: "Only POST is allowed." },
      });
      return;
    }

    const body = parseBody(req.body ?? "{}");
    if (!body) {
      sendCors(res, 400, {
        success: false,
        error: { code: "INVALID_BODY", message: "Expected { taskId: string, base64Image: string }." },
      });
      return;
    }

    const { taskId, base64Image } = body;
    if (!taskId.trim()) {
      sendCors(res, 400, {
        success: false,
        error: { code: "INVALID_TASK_ID", message: "taskId is required." },
      });
      return;
    }
    if (!base64Image || typeof base64Image !== "string") {
      sendCors(res, 400, {
        success: false,
        error: { code: "INVALID_IMAGE", message: "base64Image is required." },
      });
      return;
    }

    const task = await getTaskConfig(taskId);
    if (!task?.config) {
      sendCors(res, 404, {
        success: false,
        error: { code: "TASK_NOT_FOUND", message: `No config at ${FIRESTORE_PATH}/${taskId}.` },
      });
      return;
    }

    const config = task.config;
    const modelId = config.model;
    if (!modelId) {
      sendCors(res, 500, {
        success: false,
        error: { code: "INVALID_CONFIG", message: "config.model is required." },
      });
      return;
    }

    const projectId = process.env.GCLOUD_PROJECT ?? process.env.GCP_PROJECT;
    if (!projectId) {
      sendCors(res, 500, {
        success: false,
        error: { code: "MISCONFIGURED", message: "Project ID not available." },
      });
      return;
    }

    const location = (process.env.VERTEX_AI_LOCATION as string) || DEFAULT_LOCATION;

    try {
      const vertex = new VertexAI({ project: projectId, location });
      const generativeModel = vertex.getGenerativeModel({
        model: modelId,
        systemInstruction:
          typeof config.systemInstruction === "string" && config.systemInstruction.trim()
            ? config.systemInstruction.trim()
            : undefined,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: config.temperature ?? 0.2,
        },
      });

      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
        },
      };
      const userText =
        typeof config.userPrompt === "string" && config.userPrompt.trim()
          ? config.userPrompt.trim()
          : "Return valid JSON only based on the system instruction.";
      const result = await generativeModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [imagePart, { text: userText }],
          },
        ],
      });

      const candidate = result.response?.candidates?.[0];
      const content = candidate?.content?.parts?.[0]?.text;
      if (content === undefined || content === null) {
        sendCors(res, 502, {
          success: false,
          error: {
            code: "NO_CONTENT",
            message: "Model returned no content.",
          },
        });
        return;
      }

      let data: Record<string, unknown>;
      try {
        data = JSON.parse(content) as Record<string, unknown>;
      } catch {
        sendCors(res, 502, {
          success: false,
          error: {
            code: "INVALID_JSON",
            message: "Model response was not valid JSON.",
          },
        });
        return;
      }

      sendCors(res, 200, { success: true, data });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const code = err instanceof Error ? err.name : "VERTEX_AI_ERROR";
      sendCors(res, 500, {
        success: false,
        error: { code, message },
      });
    }
  }
);
