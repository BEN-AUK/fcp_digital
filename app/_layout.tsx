import "../src/i18n";
import { useEffect } from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { useVenueStore } from "@/stores/venueStore";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  useVenueAuth();
  const isVenueReady = useVenueStore((s) => s.isReady);
  const isAuthenticated = useVenueStore((s) => s.isAuthenticated);

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
    // 唯一规则：已认证 → 主界面；未认证 → 登录。不经过员工选择。
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }
    router.replace("/(app)");
  }, [isVenueReady, isAuthenticated, pathname, router]);

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
