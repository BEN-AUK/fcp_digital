import "../src/i18n";
import { useEffect } from "react";
import { Stack, useRouter, usePathname, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { fetchOwnerStaffFromCloud } from "@/auth/syncOwnerStaff";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  useVenueAuth();
  const isVenueReady = useVenueStore((s) => s.isReady);
  const isAuthenticated = useVenueStore((s) => s.isAuthenticated);
  const venue = useVenueStore((s) => s.venue);
  const staff = useStaffStore((s) => s.staff);

  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (!isVenueReady) return;
    // 授权链接 /join?t=xxx：允许未登录直接进入 join 页，完成后跳主界面。避免 usePathname 未同步时误判为 "/" 导致被重定向到登录。
    const isJoinPage =
      pathname === "/join" ||
      (typeof window !== "undefined" && window.location?.pathname === "/join");
    if (isJoinPage) return;
    if (pathname !== "/") return;
    if (!isAuthenticated) {
      router.replace("/login" as import("expo-router").Href);
      return;
    }
    // 老板：已有本地 staff 且 venue 一致则直接进首页；否则静默拉取云端 owner 记录并写入 staffStore，避免新设备重复 Onboarding。
    const uid = venue?.uid;
    if (!uid) {
      router.replace("/(app)/(home)/home" as Href);
      return;
    }
    if (staff && staff.venueId === venue.venueId) {
      router.replace("/(app)/(home)/home" as Href);
      return;
    }
    fetchOwnerStaffFromCloud(uid).then((ownerStaff) => {
      if (ownerStaff) {
        useStaffStore.getState().setStaff(ownerStaff);
        router.replace("/(app)/(home)/home" as Href);
      } else {
        router.replace("/join?owner=1" as Href);
      }
    });
  }, [isVenueReady, isAuthenticated, pathname, router, venue?.uid, venue?.venueId, staff]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

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
