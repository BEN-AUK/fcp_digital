import {
  collection,
  doc,
  type CollectionReference,
  type DocumentReference,
} from "firebase/firestore";
import { getFirestoreDb } from "@/config/firebase";
import type { User } from "@/models/User";
import type { Invite } from "@/models/Invite";

/** Collection ref for venue staff: venues/{venueId}/users */
export type StaffCollectionRef = CollectionReference<User>;
/** Document ref for a staff member: venues/{venueId}/users/{staffId} */
export type StaffDocumentRef = DocumentReference<User>;
/** Collection ref for venue invites: venues/{venueId}/invites */
export type InviteCollectionRef = CollectionReference<Invite>;
/** Document ref for an invite: venues/{venueId}/invites/{inviteId} */
export type InviteDocumentRef = DocumentReference<Invite>;

/**
 * Returns the staff subcollection reference for a venue.
 * Path: venues/{venueId}/users
 */
export function getStaffCol(venueId: string): StaffCollectionRef {
  const db = getFirestoreDb();
  return collection(db, "venues", venueId, "users") as StaffCollectionRef;
}

/**
 * Returns the document reference for a staff member in a venue.
 * Path: venues/{venueId}/users/{staffId}
 */
export function getStaffDoc(
  venueId: string,
  staffId: string
): StaffDocumentRef {
  const db = getFirestoreDb();
  return doc(db, "venues", venueId, "users", staffId) as StaffDocumentRef;
}

/**
 * Returns the invites subcollection reference for a venue.
 * Path: venues/{venueId}/invites
 */
export function getInviteCol(venueId: string): InviteCollectionRef {
  const db = getFirestoreDb();
  return collection(db, "venues", venueId, "invites") as InviteCollectionRef;
}

/**
 * Returns the document reference for an invite in a venue.
 * Path: venues/{venueId}/invites/{inviteId}
 */
export function getInviteDoc(
  venueId: string,
  inviteId: string
): InviteDocumentRef {
  const db = getFirestoreDb();
  return doc(db, "venues", venueId, "invites", inviteId) as InviteDocumentRef;
}
