import {
  collection,
  doc,
  type CollectionReference,
  type DocumentReference,
} from "firebase/firestore";
import { getFirestoreDb } from "@/config/firebase";
import type { User } from "@/models/User";
import type { Invite } from "@/models/Invite";
import type { Device, SystemDeviceType } from "@/types/Device";

/** Collection ref for venue staff: venues/{venueId}/users */
export type StaffCollectionRef = CollectionReference<User>;
/** Document ref for a staff member: venues/{venueId}/users/{staffId} */
export type StaffDocumentRef = DocumentReference<User>;
/** Collection ref for venue invites: venues/{venueId}/invites */
export type InviteCollectionRef = CollectionReference<Invite>;
/** Document ref for an invite: venues/{venueId}/invites/{inviteId} */
export type InviteDocumentRef = DocumentReference<Invite>;
/** Collection ref for venue devices: venues/{venueId}/devices */
export type DeviceCollectionRef = CollectionReference<Device>;
/** Document ref for a device: venues/{venueId}/devices/{deviceId} */
export type DeviceDocumentRef = DocumentReference<Device>;
/** Collection ref for system device types: systemConfig/deviceSettings/deviceTypes */
export type SystemDeviceTypesCollectionRef =
  CollectionReference<SystemDeviceType>;

/**
 * Returns the system device types collection reference.
 * Path: systemConfig/deviceSettings/deviceTypes
 */
export function getSystemDeviceTypesCol(): SystemDeviceTypesCollectionRef {
  const db = getFirestoreDb();
  return collection(
    db,
    "systemConfig",
    "deviceSettings",
    "deviceTypes"
  ) as SystemDeviceTypesCollectionRef;
}

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

/**
 * Returns the devices subcollection reference for a venue.
 * Path: venues/{venueId}/devices
 */
export function getDeviceCol(venueId: string): DeviceCollectionRef {
  const db = getFirestoreDb();
  return collection(db, "venues", venueId, "devices") as DeviceCollectionRef;
}

/**
 * Returns the document reference for a device in a venue.
 * Path: venues/{venueId}/devices/{deviceId}
 */
export function getDeviceDoc(
  venueId: string,
  deviceId: string
): DeviceDocumentRef {
  const db = getFirestoreDb();
  return doc(db, "venues", venueId, "devices", deviceId) as DeviceDocumentRef;
}
