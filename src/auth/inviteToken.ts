import { Linking } from "react-native";
import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { getFirestoreDb } from "@/config/firebase";

const INVITE_EXPIRY_DAYS = 7;

const INVITE_PARAM = "inviteToken";
const JOIN_PARAM = "t";

const JOIN_BASE_URL = "http://localhost:8081";

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
 * Returns invite payload if doc exists and expiresAt > now; otherwise null.
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
  const expiresAt = data?.expiresAt as Timestamp | undefined;
  if (!venueId || !expiresAt || expiresAt.toMillis() <= Date.now()) return null;

  const venueRef = doc(db, "venues", venueId);
  const venueSnap = await getDoc(venueRef);
  const venueName = (venueSnap.exists() && (venueSnap.data()?.shopName as string | undefined)) ?? venueId;

  return {
    venueId,
    staffId: snap.id,
    staffName,
    venueName,
  };
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
