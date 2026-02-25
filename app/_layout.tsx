import "../src/i18n";
import { useEffect } from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";
import { getInviteTokenFromUrl, parseInviteTokenPayload } from "@/auth/inviteToken";
import type { StaffContext } from "@/types/auth";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  useVenueAuth();
  const venue = useVenueStore((s) => s.venue);
  const isVenueReady = useVenueStore((s) => s.isReady);
  const isAuthenticated = useVenueStore((s) => s.isAuthenticated);
  const setStaff = useStaffStore((s) => s.setStaff);
  const staff = useStaffStore((s) => s.staff);

  useEffect(() => {
    if (!isVenueReady || pathname !== "/") return;
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }
    if (!staff) {
      router.replace("/(auth)/staff");
      return;
    }
    router.replace("/(app)");
  }, [isVenueReady, isAuthenticated, staff, pathname, router]);

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
