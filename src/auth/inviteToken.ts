import { Linking } from "react-native";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot, Timestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/config/firebase";
import { getInviteCol, getInviteDoc } from "@/config/dbPaths";
import type { Invite, InviteStatus, InviteWrite, Venue } from "@/models";

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

/** Generate a UUID v4 for inviteId. Required for every document in invites collection. */
function generateInviteId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const arr = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  arr[6] = (arr[6]! & 0x0f) | 0x40;
  arr[8] = (arr[8]! & 0x3f) | 0x80;
  const hex = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Staff invite record (doc id + Invite fields) for real-time list. */
export type StaffInviteRecord = {
  id: string;
  token: string;
  status: InviteStatus;
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
  venueName: string;
};

/**
 * Validate invite token against Firestore subcollection venues/{venueId}/invites/{token}.
 * Accepts both legacy (expiresAt) and staff-invite (status) doc shapes.
 * Caller must supply venueId (e.g. from Mode B token payload).
 */
export async function validateInviteToken(
  venueId: string,
  token: string
): Promise<ValidatedInvite | null> {
  if (!venueId?.trim() || !token?.trim()) return null;
  const inviteRef = getInviteDoc(venueId, token.trim());
  const snap = await getDoc(inviteRef);
  if (!snap.exists()) return null;
  const data = snap.data() as Invite | undefined;
  const status = data?.status;
  const expiresAt = data?.expiresAt;
  // 仅允许 status === "pending" 的链接进入加入流程；active/completed 视为已使用
  if (status != null && status !== "pending") return null;
  const validByExpiry = expiresAt && expiresAt.toMillis() > Date.now();
  const validByStatus = status === "pending";
  if (!validByExpiry && !validByStatus) return null;

  const db = getFirestoreDb();
  const venueRef = doc(db, "venues", venueId);
  const venueSnap = await getDoc(venueRef);
  const venueData = venueSnap.exists() ? (venueSnap.data() as Venue) : undefined;
  const venueName = venueData?.shopName ?? venueId;

  return {
    venueId,
    staffId: snap.id,
    venueName,
  };
}

/**
 * Create a staff invite in Firestore (venues/{venueId}/invites) and return the join URL.
 * Uses Mode B link (base64 payload with venueId) so join can validate without knowing venueId from elsewhere.
 * Caller may pass venueName for display; if omitted, join will load it from Firestore.
 */
export async function createStaffInvite(
  venueId: string,
  venueName?: string
): Promise<{ url: string; token: string }> {
  if (!venueId?.trim()) throw new Error("venueId required");
  const token = randomToken16();
  const ref = getInviteDoc(venueId, token);
  const inviteData: InviteWrite = {
    inviteId: generateInviteId(),
    venueId,
    token,
    status: "pending",
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, inviteData);
  const url = generateInviteLink(token, token, venueId, venueName);
  return { url, token };
}

/**
 * Subscribe to all staff invites for a venue (real-time list). Returns unsubscribe.
 * Path: venues/{venueId}/invites.
 */
export function subscribeStaffInvites(
  venueId: string,
  onUpdate: (invites: StaffInviteRecord[]) => void
): () => void {
  const colRef = getInviteCol(venueId);
  const unsubscribe = onSnapshot(colRef, (snap) => {
    const invites: StaffInviteRecord[] = snap.docs.map((d) => {
      const dta = d.data() as Invite;
      return {
        id: d.id,
        token: dta.token ?? d.id,
        status: (dta.status ?? "pending") as InviteStatus,
        createdAt: dta.createdAt,
      };
    });
    onUpdate(invites);
  });
  return unsubscribe;
}

/**
 * Revoke a staff invite by setting status to "revoked". Doc must belong to caller's venue (enforce via rules).
 */
export async function revokeStaffInvite(venueId: string, token: string): Promise<void> {
  if (!venueId?.trim()) return;
  const ref = getInviteDoc(venueId, token);
  await updateDoc(ref, { status: "revoked" });
}

/**
 * Mark a staff invite as "completed" after staff has completed join. Used by /join flow.
 * Ensures each invite URL can only be used once.
 */
export async function setInviteCompleted(venueId: string, token: string): Promise<void> {
  if (!venueId?.trim()) return;
  const ref = getInviteDoc(venueId, token);
  await updateDoc(ref, { status: "completed" });
}

/**
 * Create an invite document in Firestore (venues/{venueId}/invites).
 * Uses doc id as token. Caller must have venueId (owner context).
 */
export async function createInvite(venueId: string): Promise<{ token: string }> {
  if (!venueId?.trim()) throw new Error("venueId required");
  const token = randomToken16();
  const ref = getInviteDoc(venueId, token);
  const expiresAt = Timestamp.fromMillis(
    Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );
  const inviteData: InviteWrite = {
    inviteId: generateInviteId(),
    venueId,
    token,
    expiresAt,
  };
  await setDoc(ref, inviteData);
  return { token };
}
