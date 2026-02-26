import { useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import Head from "expo-router/head";
import { useFocusEffect } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { useVenueStore } from "@/stores/venueStore";
import { createStaffInvite } from "@/auth/inviteToken";
import { styles } from "./authorization.styles";

export default function StaffAuthorizationScreen() {
  const { t } = useTranslation();
  const venue = useVenueStore((s) => s.venue);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setGeneratedLink(null);
      setIsGenerating(false);
    }, [])
  );

  const handleGenerateQRCode = async () => {
    if (!venue?.venueId || isGenerating) return;
    setIsGenerating(true);
    try {
      const { url } = await createStaffInvite(venue.venueId);
      setGeneratedLink(url);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t("manage.authorise_staff")}</title>
      </Head>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>{t("manage.authorise_staff")}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
            isGenerating && styles.primaryButtonDisabled,
          ]}
          onPress={handleGenerateQRCode}
          disabled={isGenerating}
          accessibilityRole="button"
          accessibilityLabel={t("manage.generate_qr_code")}
        >
          <Text style={styles.primaryButtonText}>
            {isGenerating ? t("common.loading") : t("manage.generate_qr_code")}
          </Text>
        </Pressable>
        {generatedLink !== null && (
          <>
            <View style={styles.linkSection}>
              <Text style={styles.linkLabel}>
                {t("manage.generated_link_label")}
              </Text>
              <Text style={styles.linkText} selectable>
                {generatedLink}
              </Text>
            </View>
            <View style={styles.qrSection}>
              <QRCode value={generatedLink} size={200} />
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}
