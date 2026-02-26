import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { useVenueStore } from "@/stores/venueStore";
import { theme } from "@/styles/theme";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { styles } from "./index.styles";

export default function IndexScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isVenueReady = useVenueStore((s) => s.isReady);
  const isAuthenticated = useVenueStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isVenueReady) return;
    if (!isAuthenticated) {
      router.replace("/login" as import("expo-router").Href);
      return;
    }
    router.replace("/(app)/(home)/home" as Href);
  }, [isVenueReady, isAuthenticated, router]);

  return (
    <ScreenContainer style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} accessibilityLabel={t("common.loading")} />
    </ScreenContainer>
  );
}
