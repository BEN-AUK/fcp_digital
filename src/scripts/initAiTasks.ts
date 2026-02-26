/**
 * Initializes AI task config in Firestore: systemConfig/ai_tasks/tasks/SCAN_DEVICE
 * Run: npm run init:ai-tasks (requires .env with EXPO_PUBLIC_FIREBASE_*)
 */
import "dotenv/config";

import { setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/config/firebase";
import { getAiTaskDoc } from "@/config/dbPaths";

const SCAN_DEVICE_TASK_ID = "SCAN_DEVICE";

const SCAN_DEVICE_PAYLOAD = {
  taskId: SCAN_DEVICE_TASK_ID,
  description: "设备铭牌智能识别",
  config: {
    model: "gemini-2.5-flash",
    temperature: 0.1,
    timeout: 10000,
    systemInstruction:
      "你是一个资深设备专家。请从图中识别并提取以下字段：brand (品牌), model (型号), serialNumber (序列号), type (设备类型)。要求：1. 允许根据型号规律或视觉特征进行高度确定（置信度 > 90%）的逻辑推断。2. 无法确定则返回 null。3. 仅返回纯 JSON 格式。",
    responseSchema: {
      brand: "string",
      model: "string",
      serialNumber: "string",
      type: "string",
    },
  },
  metadata: {
    version: "1.1",
    updatedAt: serverTimestamp(),
  },
};

async function main(): Promise<void> {
  const db = getFirestoreDb();
  const ref = getAiTaskDoc(SCAN_DEVICE_TASK_ID);

  await setDoc(ref, SCAN_DEVICE_PAYLOAD);
  console.log("[initAiTasks] Written: systemConfig/ai_tasks/tasks/SCAN_DEVICE");

  const snap = await getDoc(ref);
  if (!snap.exists()) {
    console.error("[initAiTasks] Verification failed: document not found.");
    process.exit(1);
  }

  const data = snap.data();
  const hasTaskId = data?.taskId === SCAN_DEVICE_TASK_ID;
  const hasConfig = !!data?.config?.model && !!data?.config?.responseSchema;
  const hasMetadata = data?.metadata?.version === "1.1" && !!data?.metadata?.updatedAt;

  if (hasTaskId && hasConfig && hasMetadata) {
    console.log("[initAiTasks] Verified: taskId, config, metadata present.");
  } else {
    console.error("[initAiTasks] Verification failed: missing or invalid fields.", {
      hasTaskId,
      hasConfig,
      hasMetadata,
    });
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[initAiTasks] Error:", err);
  process.exit(1);
});
