import type { Timestamp, FieldValue } from "firebase/firestore";

/**
 * Firestore document shape for the "invites" collection.
 * Audited from: src/auth/inviteToken.ts setDoc (createStaffInvite, createInvite) and updateDoc.
 * Two shapes in use: status-based (pending/active/completed/revoked) and legacy (expiresAt).
 */
export type InviteStatus = "pending" | "active" | "completed" | "revoked";

export interface Invite {
  /** UUID, required for every document in invites collection. */
  inviteId: string;
  venueId: string;
  token: string;
  /** Status-based flow (createStaffInvite); updateDoc sets status to "revoked" or "completed". */
  status?: InviteStatus;
  createdAt?: Timestamp;
  /** Legacy flow (createInvite); doc may have expiresAt instead of status. */
  expiresAt?: Timestamp;
}

/** Write payload: createdAt may be serverTimestamp(); expiresAt may be Timestamp or set at write. */
export type InviteWrite = Omit<Invite, "createdAt" | "expiresAt"> & {
  createdAt?: FieldValue;
  expiresAt?: Timestamp;
};
