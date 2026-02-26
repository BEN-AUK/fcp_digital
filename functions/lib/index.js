"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImageWithAI = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const vertexai_1 = require("@google-cloud/vertexai");
admin.initializeApp();
const FIRESTORE_PATH = "systemConfig/ai_tasks/tasks";
const DEFAULT_LOCATION = "us-central1";
/** Function timeout (deploy-time). config.timeout in Firestore is per-task and can be used for Vertex request timeout when SDK supports it. */
const DEFAULT_FUNCTION_TIMEOUT_SEC = 120;
const MEMORY = "512MiB";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
};
function sendCors(res, status, body) {
    res.set(corsHeaders);
    res.status(status);
    if (body !== null) {
        res.json(body);
    }
    else {
        res.send();
    }
}
function parseBody(raw) {
    try {
        const parsed = JSON.parse(raw);
        if (parsed &&
            typeof parsed === "object" &&
            "taskId" in parsed &&
            "base64Image" in parsed &&
            typeof parsed.taskId === "string" &&
            typeof parsed.base64Image === "string") {
            return parsed;
        }
    }
    catch {
        // ignore
    }
    return null;
}
async function getTaskConfig(taskId) {
    const db = admin.firestore();
    const ref = db.collection("systemConfig").doc("ai_tasks").collection("tasks").doc(taskId);
    const snap = await ref.get();
    if (!snap.exists) {
        return null;
    }
    return snap.data();
}
exports.processImageWithAI = (0, https_1.onRequest)({
    cors: true,
    timeoutSeconds: DEFAULT_FUNCTION_TIMEOUT_SEC,
    memory: MEMORY,
}, async (req, res) => {
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
    const location = process.env.VERTEX_AI_LOCATION || DEFAULT_LOCATION;
    try {
        const vertex = new vertexai_1.VertexAI({ project: projectId, location });
        const generativeModel = vertex.getGenerativeModel({
            model: modelId,
            systemInstruction: typeof config.systemInstruction === "string" && config.systemInstruction.trim()
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
        const userText = typeof config.userPrompt === "string" && config.userPrompt.trim()
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
        let data;
        try {
            data = JSON.parse(content);
        }
        catch {
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
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const code = err instanceof Error ? err.name : "VERTEX_AI_ERROR";
        sendCors(res, 500, {
            success: false,
            error: { code, message },
        });
    }
});
