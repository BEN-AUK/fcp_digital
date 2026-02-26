import "../src/i18n";
import { useEffect } from "react";
import { Stack, useRouter, usePathname, useSegments, type Href } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { fetchOwnerStaffFromCloud } from "@/auth/syncOwnerStaff";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";

/** 加载态：Firebase 校验 Token 期间不挂载任何业务路由，防止闪烁或权限泄露 */
function AuthLoadingScreen() {
  const { t } = useTranslation();
  return (
    <View style={authLoadingStyles.container}>
      <ActivityIndicator size="large" accessibilityLabel={t("common.loading")} />
    </View>
  );
}

const authLoadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  useVenueAuth();

  const isReady = useVenueStore((s) => s.isReady);
  const isAuthenticated = useVenueStore((s) => s.isAuthenticated);
  const venue = useVenueStore((s) => s.venue);
  const staff = useStaffStore((s) => s.staff);

  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  const isLoading = !isReady;
  const path =
    typeof window !== "undefined" ? window.location?.pathname ?? pathname : pathname;
  const inAuthGroup =
    segments[0] === "(auth)" ||
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/join");
  const isAllowedUnauthenticated =
    path === "/login" || path === "/register" || path === "/join" || path.startsWith("/join");

  useEffect(() => {
    if (isLoading) return;

    const currentPath =
      typeof window !== "undefined" ? window.location?.pathname ?? pathname : pathname;
    const isJoinPage = currentPath === "/join" || pathname === "/join";

    if (isJoinPage) return;

    if (!isAuthenticated && !isAllowedUnauthenticated) {
      router.replace("/login" as Href);
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/(home)/home" as Href);
      return;
    }

    if (pathname !== "/" && currentPath !== "/") return;

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
  }, [
    isLoading,
    isAuthenticated,
    inAuthGroup,
    isAllowedUnauthenticated,
    pathname,
    path,
    router,
    venue?.uid,
    venue?.venueId,
    staff,
  ]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <StatusBar style="auto" />
        <AuthLoadingScreen />
      </>
    );
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
