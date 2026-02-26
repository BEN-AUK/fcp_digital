import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getFirestoreDb } from "@/config/firebase";
import type { User } from "@/models";

export type VenueUserRecord = Pick<User, "staffId" | "displayName">;

/**
 * Subscribe to active users for a venue (isActive === true).
 * Returns unsubscribe function.
 */
export function subscribeActiveUsers(
  venueId: string,
  onUpdate: (users: VenueUserRecord[]) => void
): () => void {
  const db = getFirestoreDb();
  const q = query(
    collection(db, "users"),
    where("venueId", "==", venueId),
    where("isActive", "==", true)
  );
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
 */
export async function deactivateUser(staffId: string): Promise<void> {
  const db = getFirestoreDb();
  const userRef = doc(db, "users", staffId);
  await updateDoc(userRef, { isActive: false });
}
