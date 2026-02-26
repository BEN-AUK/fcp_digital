import type { Timestamp, FieldValue } from "firebase/firestore";

/**
 * Firestore document shape for the "users" collection.
 * Doc ID = staffId. All writes carry venueId (write protection).
 * Audited from: src/auth/staffOnboarding.ts setDoc.
 */
export interface User {
  displayName: string;
  signature: string;
  deviceId: string;
  created_at?: Timestamp;
  is_owner: boolean;
  venueId: string;
  staffId: string;
}

/** Write payload: created_at may be serverTimestamp() (FieldValue). */
export type UserWrite = Omit<User, "created_at"> & { created_at?: FieldValue };
