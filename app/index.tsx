import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";
import { useTranslation } from "react-i18next";
import { styles } from "./index.styles";

export default function IndexScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isVenueReady = useVenueStore((s) => s.isReady);
  const isAuthenticated = useVenueStore((s) => s.isAuthenticated);
  const staff = useStaffStore((s) => s.staff);

  useEffect(() => {
    if (!isVenueReady) return;
    if (staff) {
      router.replace("/(app)");
      return;
    }
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }
    if (!staff) {
      router.replace("/(auth)/staff");
      return;
    }
    router.replace("/(app)");
  }, [isVenueReady, isAuthenticated, staff, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" accessibilityLabel={t("common.loading")} />
    </View>
  );
}
