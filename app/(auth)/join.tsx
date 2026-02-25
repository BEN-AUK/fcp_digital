import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { getJoinTokenFromUrl, parseInviteTokenPayload } from "@/auth/inviteToken";
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
      const raw =
        typeof params.t === "string" ? params.t : await getJoinTokenFromUrl();
      const token = raw?.trim() ? decodeURIComponent(raw.trim()) : null;
      if (!token) {
        if (!cancelled) setStatus("error");
        return;
      }
      const payload = parseInviteTokenPayload(token);
      if (cancelled) return;
      if (!payload?.venueId) {
        setStatus("error");
        return;
      }
      const context: StaffContext = {
        staffId: payload.staffId,
        displayName: payload.displayName,
        venueId: payload.venueId,
        ...(payload.venueName != null && { venueName: payload.venueName }),
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
