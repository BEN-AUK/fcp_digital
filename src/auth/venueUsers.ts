import { query, where, onSnapshot, updateDoc } from "firebase/firestore";
import { getStaffCol, getStaffDoc } from "@/config/dbPaths";
import type { User } from "@/models";

export type VenueUserRecord = Pick<User, "staffId" | "displayName">;

/**
 * Subscribe to active users for a venue (isActive === true).
 * Path: venues/{venueId}/users. Returns unsubscribe function.
 */
export function subscribeActiveUsers(
  venueId: string,
  onUpdate: (users: VenueUserRecord[]) => void
): () => void {
  const colRef = getStaffCol(venueId);
  const q = query(colRef, where("isActive", "==", true));
  const unsubscribe = onSnapshot(q, (snap) => {
    const users: VenueUserRecord[] = snap.docs.map((d) => {
      const data = d.data() as User;
      return {
        staffId: d.id,
        displayName: data.displayName ?? "",
      };
    });
    onUpdate(users);
  });
  return unsubscribe;
}

/**
 * Soft-delete: set user's isActive to false. Does not delete the document.
 * Path: venues/{venueId}/users/{staffId}.
 */
export async function deactivateUser(venueId: string, staffId: string): Promise<void> {
  if (!venueId?.trim()) return;
  const userRef = getStaffDoc(venueId, staffId);
  await updateDoc(userRef, { isActive: false });
}
