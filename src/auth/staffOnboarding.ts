import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import * as Device from "expo-device";
import { getFirestoreDb } from "@/config/firebase";

export type StaffOnboardingPayload = {
  staffId: string;
  venueId: string;
  displayName: string;
  signature: string;
  deviceId: string;
};

/**
 * Get a stable device identifier for attestation.
 * Prefer osBuildId (Android/iOS) or modelId (iOS), fallback to designName/deviceName or constant for web.
 */
export async function getDeviceId(): Promise<string> {
  try {
    const osBuildId = Device.osBuildId ?? null;
    const modelId = Device.modelId ?? null;
    const designName = Device.designName ?? null;
    const deviceName = Device.deviceName ?? null;
    return (
      osBuildId ??
      modelId ??
      designName ??
      deviceName ??
      "web-unknown"
    );
  } catch {
    return "unknown";
  }
}

/**
 * Write staff onboarding attestation to Firestore.
 * Collection: top-level "users". Doc ID = staffId. All writes carry venueId for security.
 * Fields: displayName, signature (base64), deviceId, created_at (serverTimestamp), is_owner: false, venueId.
 * Caller must only persist to staffStore and navigate after this succeeds.
 */
export async function saveStaffOnboarding(
  payload: StaffOnboardingPayload
): Promise<void> {
  const db = getFirestoreDb();
  const userRef = doc(db, "users", payload.staffId);
  await setDoc(userRef, {
    displayName: payload.displayName.trim(),
    signature: payload.signature,
    deviceId: payload.deviceId,
    created_at: serverTimestamp(),
    is_owner: false,
    venueId: payload.venueId,
    staffId: payload.staffId,
  });
}
