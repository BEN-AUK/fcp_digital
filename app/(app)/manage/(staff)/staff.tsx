import { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import Head from "expo-router/head";
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
    case "completed":
      return "auth.inviteStatusCompleted";
    case "revoked":
      return "auth.inviteStatusRevoked";
    default:
      return "auth.inviteStatusPending";
  }
}

export default function ManageStaffScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const venue = useVenueStore((s) => s.venue);
  const [invites, setInvites] = useState<StaffInviteRecord[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      header: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    if (!venue?.venueId) return;
    const unsubscribe = subscribeStaffInvites(venue.venueId, setInvites);
    return unsubscribe;
  }, [venue?.venueId]);

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
    <>
      <Head>
        <title>{t("manage.manage_staff")}</title>
      </Head>
      <View style={styles.container}>
      <ScrollView
        style={styles.scrollSection}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
    </>
  );
}
