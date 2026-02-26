import type { Timestamp, FieldValue } from "firebase/firestore";

/**
 * Firestore document shape for the "venues" collection.
 * Doc ID = venueId (Firebase Auth uid). Audited from: src/auth/useVenueAuth.ts setDoc.
 */
export interface Venue {
  venueId: string;
  email: string;
  shopName: string | null;
  createdAt?: Timestamp;
}

/** Write payload: createdAt may be serverTimestamp() (FieldValue). */
export type VenueWrite = Omit<Venue, "createdAt"> & { createdAt?: FieldValue };
