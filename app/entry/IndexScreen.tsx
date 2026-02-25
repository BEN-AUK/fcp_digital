import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useVenueStore } from "@/stores/venueStore";
import { styles } from "./index.styles";

export default function IndexScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isVenueReady = useVenueStore((s) => s.isReady);
  const isAuthenticated = useVenueStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isVenueReady) return;
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }
    router.replace("/(app)");
  }, [isVenueReady, isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" accessibilityLabel={t("common.loading")} />
    </View>
  );
}
