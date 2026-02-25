import { Linking } from "react-native";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "@/config/firebase";

const INVITE_EXPIRY_DAYS = 7;

const INVITE_PARAM = "inviteToken";
const JOIN_PARAM = "t";

const JOIN_BASE_URL = "http://localhost:8081";

function randomToken16(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  const arr = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < 16; i++) s += chars[arr[i] % chars.length];
  return s;
}

/** Staff invite record stored in Firestore invites collection. */
export type StaffInviteRecord = {
  id: string;
  token: string;
  staffName: string;
  status: "pending" | "active" | "revoked";
  createdAt?: Timestamp;
};

/** Payload encoded in Mode B invite token (base64 JSON). */
export type InviteTokenPayload = {
  staffId: string;
  displayName: string;
  venueId?: string;
  venueName?: string;
};

/** Get inviteToken from current URL (web: location.search; native: Linking.getInitialURL). */
export async function getInviteTokenFromUrl(): Promise<string | null> {
  return getTokenParamFromUrl(INVITE_PARAM);
}

/** Get join token (param "t") from current URL for /join route. */
export async function getJoinTokenFromUrl(): Promise<string | null> {
  return getTokenParamFromUrl(JOIN_PARAM);
}

async function getTokenParamFromUrl(param: string): Promise<string | null> {
  if (typeof window !== "undefined" && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }
  try {
    const url = await Linking.getInitialURL();
    if (!url) return null;
    const parsed = new URL(url);
    return parsed.searchParams.get(param);
  } catch {
    return null;
  }
}

/**
 * Generate Mode B invite link: encode staff info as base64 JSON and return join URL.
 * Token includes venueId so staff can bind without being venue-logged in.
 */
export function generateInviteLink(
  staffId: string,
  displayName: string,
  venueId: string,
  venueName?: string
): string {
  const payload: InviteTokenPayload = {
    staffId,
    displayName: displayName || staffId,
    venueId,
    ...(venueName != null && { venueName }),
  };
  const token = btoa(JSON.stringify(payload));
  return `${JOIN_BASE_URL}/join?t=${encodeURIComponent(token)}`;
}

/** Parse invite token payload (base64 JSON for Mode B, or legacy raw token as staffId). */
export function parseInviteTokenPayload(token: string): InviteTokenPayload | null {
  try {
    const decoded = JSON.parse(atob(token)) as InviteTokenPayload;
    if (decoded?.staffId) {
      return {
        staffId: decoded.staffId,
        displayName: decoded.displayName ?? decoded.staffId,
        venueId: decoded.venueId,
        venueName: decoded.venueName,
      };
    }
  } catch {
    // Not base64 JSON; use token as staffId (legacy)
  }
  return { staffId: token, displayName: token };
}

export type ValidatedInvite = {
  venueId: string;
  staffId: string;
  staffName: string;
  venueName: string;
};

/**
 * Validate invite token against Firestore invites collection.
 * Accepts both legacy (expiresAt) and staff-invite (status) doc shapes.
 */
export async function validateInviteToken(token: string): Promise<ValidatedInvite | null> {
  if (!token?.trim()) return null;
  const db = getFirestoreDb();
  const inviteRef = doc(db, "invites", token.trim());
  const snap = await getDoc(inviteRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  const venueId = data?.venueId as string | undefined;
  const staffName = (data?.staffName as string | undefined) ?? "Staff";
  const status = data?.status as string | undefined;
  const expiresAt = data?.expiresAt as Timestamp | undefined;
  if (!venueId) return null;
  const validByExpiry = expiresAt && expiresAt.toMillis() > Date.now();
  const validByStatus = status === "pending" || status === "active";
  if (!validByExpiry && !validByStatus) return null;

  const venueRef = doc(db, "venues", venueId);
  const venueSnap = await getDoc(venueRef);
  const venueName = venueSnap.exists()
    ? ((venueSnap.data()?.shopName as string | undefined) ?? venueId)
    : venueId;

  return {
    venueId,
    staffId: snap.id,
    staffName,
    venueName,
  };
}

/**
 * Create a staff invite in Firestore (invites collection) and return the join URL.
 * Caller must pass current venueId (owner context). All writes carry venueId for security.
 */
export async function createStaffInvite(
  venueId: string,
  staffName: string
): Promise<{ url: string; token: string }> {
  const db = getFirestoreDb();
  const token = randomToken16();
  const ref = doc(db, "invites", token);
  await setDoc(ref, {
    venueId,
    staffName: staffName.trim() || "Staff",
    token,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return { url: `${JOIN_BASE_URL}/join?t=${token}`, token };
}

/**
 * Subscribe to all staff invites for a venue (real-time list). Returns unsubscribe.
 */
export function subscribeStaffInvites(
  venueId: string,
  onUpdate: (invites: StaffInviteRecord[]) => void
): () => void {
  const db = getFirestoreDb();
  const q = query(
    collection(db, "invites"),
    where("venueId", "==", venueId)
  );
  const unsubscribe = onSnapshot(q, (snap) => {
    const invites: StaffInviteRecord[] = snap.docs.map((d) => {
      const dta = d.data();
      return {
        id: d.id,
        token: (dta.token as string) ?? d.id,
        staffName: (dta.staffName as string) ?? "Staff",
        status: (dta.status as StaffInviteRecord["status"]) ?? "pending",
        createdAt: dta.createdAt as Timestamp | undefined,
      };
    });
    onUpdate(invites);
  });
  return unsubscribe;
}

/**
 * Revoke a staff invite by setting status to "revoked". Doc must belong to caller's venue (enforce via rules).
 */
export async function revokeStaffInvite(token: string): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, "invites", token);
  await updateDoc(ref, { status: "revoked" });
}

/**
 * Mark a staff invite as "active" after staff has completed join. Used by /join flow.
 */
export async function setInviteActive(token: string): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, "invites", token);
  await updateDoc(ref, { status: "active" });
}

/**
 * Create an invite document in Firestore (invites collection).
 * Uses doc id as token. Caller must have venueId (owner context).
 */
export async function createInvite(
  venueId: string,
  staffName: string
): Promise<{ token: string }> {
  const db = getFirestoreDb();
  const ref = doc(collection(db, "invites"));
  const expiresAt = Timestamp.fromMillis(
    Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );
  await setDoc(ref, {
    venueId,
    staffName: staffName.trim() || "Staff",
    token: ref.id,
    expiresAt,
  });
  return { token: ref.id };
}
