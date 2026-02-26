# FCP Digital – Cloud Functions

## processImageWithAI

HTTPS callable function for generic AI image processing. Fully driven by Firestore config at `systemConfig/ai_tasks/tasks/{taskId}`.

### Request

- **Method:** `POST`
- **Body:** `{ "taskId": string, "base64Image": string }`
- **CORS:** Enabled for `POST` and `OPTIONS`.

### Config (Firestore)

Path: `systemConfig/ai_tasks/tasks/{taskId}`. Required fields:

- `config.model` – Vertex AI model (e.g. `gemini-2.5-flash`)
- `config.systemInstruction` – System instruction for the model
- `config.temperature` – Optional; default `0.2`
- `config.userPrompt` – Optional user prompt; if omitted, a generic instruction is used
- `config.timeout` – Optional; reserved for future per-request timeout (ms)

Response is always JSON with `response_mime_type: "application/json"`.

### Response

- **Success:** `{ "success": true, "data": { ... } }`
- **Error:** `{ "success": false, "error": { "code": string, "message": string } }`

Codes: `METHOD_NOT_ALLOWED`, `INVALID_BODY`, `INVALID_TASK_ID`, `INVALID_IMAGE`, `TASK_NOT_FOUND`, `INVALID_CONFIG`, `MISCONFIGURED`, `NO_CONTENT`, `INVALID_JSON`, or Vertex AI error name.

### Runtime

- **Memory:** 512MiB
- **Timeout:** 120s (deploy-time). Ensure Vertex AI is enabled and `gemini-2.5-flash` is available in your region (e.g. `us-central1`).

### Env (optional)

- `VERTEX_AI_LOCATION` – Vertex AI region (default: `us-central1`).

### Deploy

From project root:

```bash
cd functions && npm install && npm run build
firebase deploy --only functions
```
