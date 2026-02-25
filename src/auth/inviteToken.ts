import { Linking } from "react-native";

const INVITE_PARAM = "inviteToken";

/** Get inviteToken from current URL (web: location.search; native: Linking.getInitialURL). */
export async function getInviteTokenFromUrl(): Promise<string | null> {
  if (typeof window !== "undefined" && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    return params.get(INVITE_PARAM);
  }
  try {
    const url = await Linking.getInitialURL();
    if (!url) return null;
    const parsed = new URL(url);
    return parsed.searchParams.get(INVITE_PARAM);
  } catch {
    return null;
  }
}

/** Parse invite token payload (e.g. JWT or base64 JSON). For now we treat raw token as staffId for silent bind. */
export function parseInviteTokenPayload(token: string): { staffId: string; displayName: string } | null {
  try {
    const decoded = JSON.parse(atob(token)) as { staffId?: string; displayName?: string };
    if (decoded?.staffId) {
      return {
        staffId: decoded.staffId,
        displayName: decoded.displayName ?? decoded.staffId,
      };
    }
  } catch {
    // Not base64 JSON; use token as staffId
  }
  return { staffId: token, displayName: token };
}
