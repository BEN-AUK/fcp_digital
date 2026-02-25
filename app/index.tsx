import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";
import { useTranslation } from "react-i18next";

export default function IndexScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isVenueReady = useVenueStore((s) => s.isReady);
  const venue = useVenueStore((s) => s.venue);
  const staff = useStaffStore((s) => s.staff);

  useEffect(() => {
    if (!isVenueReady) return;
    if (!venue) {
      router.replace("/(auth)/login");
      return;
    }
    if (!staff) {
      router.replace("/(auth)/staff");
      return;
    }
    router.replace("/(app)");
  }, [isVenueReady, venue, staff, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" accessibilityLabel={t("common.loading")} />
    </View>
  );
}
