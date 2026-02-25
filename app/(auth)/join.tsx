import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { getJoinTokenFromUrl, validateInviteToken } from "@/auth/inviteToken";
import { useStaffStore } from "@/stores/staffStore";
import type { StaffContext } from "@/types/auth";

export default function JoinScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ t?: string }>();
  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const setStaff = useStaffStore((s) => s.setStaff);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const token =
        typeof params.t === "string"
          ? params.t
          : await getJoinTokenFromUrl();
      if (!token?.trim()) {
        if (!cancelled) setStatus("error");
        return;
      }
      const validated = await validateInviteToken(token.trim());
      if (cancelled) return;
      if (!validated) {
        setStatus("error");
        return;
      }
      const context: StaffContext = {
        staffId: validated.staffId,
        displayName: validated.staffName,
        venueId: validated.venueId,
        venueName: validated.venueName,
      };
      setStaff(context);
      setStatus("done");
      router.replace("/(app)");
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [params.t, setStaff, router]);

  if (status === "error") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          {t("auth.joinInvalidToken")}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <ActivityIndicator size="large" accessibilityLabel={t("common.loading")} />
      <Text style={{ marginTop: 16, fontSize: 16 }}>{t("auth.joinBinding")}</Text>
    </View>
  );
}
