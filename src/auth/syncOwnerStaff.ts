/**
 * Silent sync: load owner staff record from Firestore venues/{uid}/users/{uid}.
 * Used when owner logs in on a new device so they don't re-trigger onboarding.
 * Collection and types aligned with src/auth/staffOnboarding.ts and src/models/User.ts.
 */
import { getDoc } from "firebase/firestore";
import { getStaffDoc } from "@/config/dbPaths";
import type { User } from "@/models";
import type { StaffContext } from "@/types/auth";

/**
 * Fetch owner staff doc from Firestore (venues/{uid}/users/{uid}).
 * Returns StaffContext if doc exists and is_owner; otherwise null.
 */
export async function fetchOwnerStaffFromCloud(uid: string): Promise<StaffContext | null> {
  const userRef = getStaffDoc(uid, uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  const data = snap.data() as User;
  if (!data?.is_owner) return null;
  return {
    staffId: data.staffId,
    displayName: data.displayName,
    venueId: data.venueId,
    signature: data.signature,
    deviceId: data.deviceId,
  };
}
