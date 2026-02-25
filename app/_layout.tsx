import "../src/i18n";
import { useEffect } from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { useVenueStore } from "@/stores/venueStore";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  useVenueAuth();
  const isVenueReady = useVenueStore((s) => s.isReady);
  const isAuthenticated = useVenueStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isVenueReady) return;
    if (pathname === "/join") return;
    if (pathname !== "/") return;
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }
    router.replace("/(app)");
  }, [isVenueReady, isAuthenticated, pathname, router]);

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
