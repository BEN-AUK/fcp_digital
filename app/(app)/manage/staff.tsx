import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useVenueStore } from "@/stores/venueStore";
import {
  createStaffInvite,
  subscribeStaffInvites,
  revokeStaffInvite,
  type StaffInviteRecord,
} from "@/auth/inviteToken";
import { styles } from "./staff.styles";

const JOIN_BASE_URL = "http://localhost:8081";

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}

function getStatusKey(status: StaffInviteRecord["status"]): string {
  switch (status) {
    case "pending":
      return "auth.inviteStatusPending";
    case "active":
      return "auth.inviteStatusActive";
    case "revoked":
      return "auth.inviteStatusRevoked";
    default:
      return "auth.inviteStatusPending";
  }
}

export default function ManageStaffScreen() {
  const { t } = useTranslation();
  const venue = useVenueStore((s) => s.venue);
  const [employeeName, setEmployeeName] = useState("");
  const [invites, setInvites] = useState<StaffInviteRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!venue?.venueId) return;
    const unsubscribe = subscribeStaffInvites(venue.venueId, setInvites);
    return unsubscribe;
  }, [venue?.venueId]);

  const handleGenerate = async () => {
    if (!venue?.venueId || isGenerating) return;
    setIsGenerating(true);
    try {
      const { url } = await createStaffInvite(venue.venueId, employeeName.trim());
      const ok = await copyToClipboard(url);
      if (ok) Alert.alert("", t("auth.inviteLinkCopied"));
      setEmployeeName("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (token: string) => {
    const url = `${JOIN_BASE_URL}/join?t=${token}`;
    const ok = await copyToClipboard(url);
    if (ok) Alert.alert("", t("auth.inviteLinkCopied"));
  };

  const handleRevoke = (invite: StaffInviteRecord) => {
    if (invite.status === "revoked") return;
    Alert.alert(
      t("auth.revoke"),
      `${t("auth.revoke")} ${invite.staffName}?`,
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("auth.revoke"),
          style: "destructive",
          onPress: () => revokeStaffInvite(invite.token),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollSection}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>{t("auth.authoriseStaff")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("auth.employeeNamePlaceholder")}
          placeholderTextColor="#6b7280"
          value={employeeName}
          onChangeText={setEmployeeName}
          editable={!isGenerating}
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isGenerating && styles.buttonDisabled,
          ]}
          onPress={handleGenerate}
          disabled={isGenerating}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>
            {isGenerating ? t("common.loading") : t("auth.generateInviteLink")}
          </Text>
        </Pressable>

        <Text style={styles.listTitle}>{t("auth.inviteListTitle")}</Text>
        <View style={styles.list}>
          {invites.map((inv) => (
            <View key={inv.id} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <Text style={styles.listItemName}>{inv.staffName}</Text>
                <Text style={styles.listItemStatus}>{t(getStatusKey(inv.status))}</Text>
              </View>
              <View style={styles.listItemActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.listItemCopyButton,
                    styles.listItemCopyButtonMargin,
                    pressed && styles.listItemCopyButtonPressed,
                  ]}
                  onPress={() => handleCopy(inv.token)}
                  accessibilityRole="button"
                >
                  <Text style={styles.listItemButtonText}>{t("auth.copyLink")}</Text>
                </Pressable>
                {inv.status !== "revoked" && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.listItemRevokeButton,
                      pressed && styles.listItemRevokeButtonPressed,
                    ]}
                    onPress={() => handleRevoke(inv)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.listItemButtonText}>{t("auth.revoke")}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
