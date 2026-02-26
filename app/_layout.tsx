import "../src/i18n";
import { useEffect } from "react";
import { Stack, useRouter, usePathname, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { useVenueStore } from "@/stores/venueStore";
import { getFirestoreDb } from "@/config/firebase";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  useVenueAuth();
  const isVenueReady = useVenueStore((s) => s.isReady);
  const isAuthenticated = useVenueStore((s) => s.isAuthenticated);
  const venue = useVenueStore((s) => s.venue);

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
    // 老板首次进入：无 staff 记录则必须先完成 Onboarding（姓名+签名），再进入主界面。
    const uid = venue?.uid;
    if (!uid) {
      router.replace("/(app)/(home)/home" as Href);
      return;
    }
    const db = getFirestoreDb();
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (!snap.exists()) {
        router.replace("/join?owner=1" as Href);
      } else {
        router.replace("/(app)/(home)/home" as Href);
      }
    });
  }, [isVenueReady, isAuthenticated, pathname, router, venue?.uid]);

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
