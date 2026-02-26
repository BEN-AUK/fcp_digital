import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import * as Device from "expo-device";
import { getFirestoreDb } from "@/config/firebase";
import type { UserWrite } from "@/models";

export type StaffOnboardingPayload = {
  staffId: string;
  venueId: string;
  displayName: string;
  signature: string;
  deviceId: string;
};

const UNRELIABLE_DEVICE_IDS = new Set(["unknown", "web-unknown", ""]);

function randomUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const hex = "0123456789abcdef";
  let s = "";
  const arr = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  arr[6] = (arr[6]! & 0x0f) | 0x40;
  arr[8] = (arr[8]! & 0x3f) | 0x80;
  for (let i = 0; i < 16; i++) {
    s += hex[arr[i]! >> 4] + hex[arr[i]! & 0x0f];
    if (i === 3 || i === 5 || i === 7 || i === 9) s += "-";
  }
  return s;
}

/**
 * Get a stable device identifier for attestation.
 * Prefer osBuildId (Android/iOS) or modelId (iOS), fallback to designName/deviceName or constant for web.
 * If none available (e.g. "unknown" / "web-unknown"), returns a random UUID so submission can proceed.
 */
export async function getDeviceId(): Promise<string> {
  try {
    const osBuildId = Device.osBuildId ?? null;
    const modelId = Device.modelId ?? null;
    const designName = Device.designName ?? null;
    const deviceName = Device.deviceName ?? null;
    const raw =
      osBuildId ??
      modelId ??
      designName ??
      deviceName ??
      "web-unknown";
    const trimmed = raw?.trim() ?? "";
    if (UNRELIABLE_DEVICE_IDS.has(trimmed) || !trimmed) {
      return randomUUID();
    }
    return trimmed;
  } catch {
    return randomUUID();
  }
}

/**
 * Write staff onboarding attestation to Firestore.
 * Collection: top-level "users". Doc ID = staffId. All writes carry venueId for security.
 * Fields: displayName, signature (base64), deviceId, created_at (serverTimestamp), is_owner, venueId.
 * is_owner: true when staffId === venueId (owner); otherwise false.
 * Caller must only persist to staffStore and navigate after this succeeds.
 */
export async function saveStaffOnboarding(
  payload: StaffOnboardingPayload
): Promise<void> {
  const db = getFirestoreDb();
  const userRef = doc(db, "users", payload.staffId);
  const isOwner = payload.staffId === payload.venueId;
  const userData: UserWrite = {
    displayName: payload.displayName.trim(),
    signature: payload.signature,
    deviceId: payload.deviceId,
    created_at: serverTimestamp(),
    is_owner: isOwner,
    venueId: payload.venueId,
    staffId: payload.staffId,
    isActive: true,
  };
  await setDoc(userRef, userData);
}
