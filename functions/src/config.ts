/**
 * Types for AI task config stored at systemConfig/ai_tasks/tasks/{taskId}.
 * No business fields hardcoded; all driven by Firestore config.
 */

export interface AiTaskConfig {
  model: string;
  temperature?: number;
  timeout?: number;
  systemInstruction?: string;
  /** Optional user prompt; if omitted, a generic instruction is used. */
  userPrompt?: string;
  responseSchema?: Record<string, string>;
}

export interface AiTaskDoc {
  taskId: string;
  description?: string;
  config: AiTaskConfig;
  metadata?: {
    version?: string;
    updatedAt?: unknown;
  };
}

export interface ProcessImageRequestBody {
  taskId: string;
  base64Image: string;
}

export interface ProcessImageSuccessResponse {
  success: true;
  data: Record<string, unknown>;
}

export interface ProcessImageErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ProcessImageResponse = ProcessImageSuccessResponse | ProcessImageErrorResponse;
