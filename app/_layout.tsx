import "../src/i18n";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";
import { getInviteTokenFromUrl, parseInviteTokenPayload } from "@/auth/inviteToken";
import type { StaffContext } from "@/types/auth";

export default function RootLayout() {
  useVenueAuth();
  const venue = useVenueStore((s) => s.venue);
  const isVenueReady = useVenueStore((s) => s.isReady);
  const setStaff = useStaffStore((s) => s.setStaff);
  const staff = useStaffStore((s) => s.staff);

  useEffect(() => {
    if (!venue || staff) return;
    getInviteTokenFromUrl().then((token) => {
      if (!token) return;
      const payload = parseInviteTokenPayload(token);
      if (!payload) return;
      const context: StaffContext = {
        staffId: payload.staffId,
        displayName: payload.displayName,
        venueId: venue.venueId,
      };
      setStaff(context);
    });
  }, [venue, staff, setStaff]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}
