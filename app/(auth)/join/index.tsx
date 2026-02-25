/**
 * Staff join / onboarding screen.
 * Requires: react-native-signature-canvas (signature), expo-device (deviceId), react-native-webview (peer of signature-canvas).
 */
import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  getJoinTokenFromUrl,
  validateInviteToken,
  parseInviteTokenPayload,
  setInviteActive,
} from "@/auth/inviteToken";
import { saveStaffOnboarding, getDeviceId } from "@/auth/staffOnboarding";
import { useStaffStore } from "@/stores/staffStore";
import type { StaffContext } from "@/types/auth";
import { SignatureCanvas } from "@/components/SignatureCanvas";
import type { SignatureViewRef } from "@/components/SignatureCanvas";
import { joinStyles } from "./join.styles";

type InviteContext = {
  staffId: string;
  venueId: string;
  venueName: string;
  /** Pre-filled from invite (optional) */
  initialDisplayName?: string;
};

export default function JoinScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ t?: string }>();
  const [status, setStatus] = useState<"loading" | "error" | "form" | "submitting">("loading");
  const [inviteContext, setInviteContext] = useState<InviteContext | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const sigRef = useRef<SignatureViewRef>(null);
  const setStaff = useStaffStore((s) => s.setStaff);
  /** When user taps Submit we request signature; onOK reads this and runs save */
  const pendingSubmitRef = useRef<{ displayName: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const raw =
        typeof params.t === "string" ? params.t : await getJoinTokenFromUrl();
      const tokenValue = raw?.trim() ? decodeURIComponent(raw.trim()) : null;
      if (!tokenValue) {
        if (!cancelled) setStatus("error");
        return;
      }

      const validated = await validateInviteToken(tokenValue);
      if (cancelled) return;
      if (validated) {
        if (!cancelled) {
          setToken(tokenValue);
          setInviteContext({
            staffId: validated.staffId,
            venueId: validated.venueId,
            venueName: validated.venueName,
            initialDisplayName: validated.staffName,
          });
          setDisplayName(validated.staffName || "");
          setStatus("form");
        }
        return;
      }

      const payload = parseInviteTokenPayload(tokenValue);
      if (cancelled) return;
      if (!payload?.venueId) {
        if (!cancelled) setStatus("error");
        return;
      }
      if (!cancelled) {
        setToken(tokenValue);
        setInviteContext({
          staffId: payload.staffId,
          venueId: payload.venueId,
          venueName: payload.venueName ?? payload.venueId,
          initialDisplayName: payload.displayName,
        });
        setDisplayName(payload.displayName || "");
        setStatus("form");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [params.t]);

  const handleSignatureOK = (signature: string) => {
    const pending = pendingSubmitRef.current;
    if (!pending) return;
    pendingSubmitRef.current = null;

    const ctx = inviteContext;
    if (!ctx || !token) return;

    setStatus("submitting");
    setSubmitError(null);
    (async () => {
      try {
        const deviceId = await getDeviceId();
        await saveStaffOnboarding({
          staffId: ctx.staffId,
          venueId: ctx.venueId,
          displayName: pending.displayName.trim(),
          signature,
          deviceId,
        });
        setInviteActive(token).catch(() => {});

        const staff: StaffContext = {
          staffId: ctx.staffId,
          displayName: pending.displayName.trim(),
          venueId: ctx.venueId,
          venueName: ctx.venueName,
          signature,
          deviceId,
        };
        setStaff(staff);
        router.replace("/(app)/index");
      } catch {
        setStatus("form");
        setSubmitError(t("auth.joinSubmitError"));
      }
    })();
  };

  const handleSubmit = () => {
    const name = displayName.trim();
    if (!name) {
      setSubmitError(t("auth.joinErrorNameRequired"));
      return;
    }
    setSubmitError(null);
    pendingSubmitRef.current = { displayName: name };
    setStatus("submitting");
    sigRef.current?.readSignature();
  };

  const handleSignatureEmpty = () => {
    if (pendingSubmitRef.current) {
      pendingSubmitRef.current = null;
      setStatus("form");
      setSubmitError(t("auth.joinErrorSignatureRequired"));
    }
  };

  if (status === "error") {
    return (
      <View style={joinStyles.errorBox}>
        <Text style={joinStyles.errorText}>{t("auth.joinInvalidToken")}</Text>
      </View>
    );
  }

  if (status === "loading") {
    return (
      <View style={joinStyles.loadingBox}>
        <ActivityIndicator size="large" accessibilityLabel={t("common.loading")} />
        <Text style={joinStyles.loadingText}>{t("auth.joinBinding")}</Text>
      </View>
    );
  }

  if (status === "form" && inviteContext) {
    return (
      <KeyboardAvoidingView
        style={joinStyles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={joinStyles.title}>{t("auth.joinOnboardingTitle")}</Text>

          <Text style={joinStyles.fieldLabel}>{t("auth.joinDisplayNameLabel")}</Text>
          <TextInput
            style={joinStyles.input}
            placeholder={t("auth.joinDisplayNamePlaceholder")}
            placeholderTextColor="#8E8E93"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            editable={status !== "submitting"}
            accessibilityLabel={t("auth.joinDisplayNameLabel")}
          />

          <Text style={[joinStyles.fieldLabel, joinStyles.signatureSection]}>
            {t("auth.joinSignatureLabel")}
          </Text>
          <SignatureCanvas
            ref={sigRef}
            onOK={handleSignatureOK}
            onEmpty={handleSignatureEmpty}
          />

          {submitError ? (
            <Text style={joinStyles.submitError}>{submitError}</Text>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              joinStyles.submitButton,
              (status === "submitting" || pressed) && joinStyles.submitButtonDisabled,
            ]}
            disabled={status === "submitting"}
            accessibilityRole="button"
            accessibilityLabel={t("auth.joinSubmit")}
          >
            {status === "submitting" ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={joinStyles.submitButtonText}>{t("auth.joinSubmit")}</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return null;
}
