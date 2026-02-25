import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { generateInviteLink } from "@/auth/inviteToken";
import { StaffWelcome } from "./StaffWelcome";
import { styles } from "./index.styles";

export default function AppHomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signOut } = useVenueAuth();
  const venue = useVenueStore((s) => s.venue);
  const staff = useStaffStore((s) => s.staff);

  const [inviteStaffName, setInviteStaffName] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const handleGenerateInvite = () => {
    if (!venue?.venueId) return;
    const displayName = inviteStaffName.trim() || "Staff";
    const staffId = displayName.replace(/\s+/g, "-").toLowerCase() || `staff-${Date.now()}`;
    setInviteLink(generateInviteLink(staffId, displayName, venue.venueId));
  };

  if (staff) {
    return <StaffWelcome staff={staff} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Venue: {venue?.venueId ?? "—"}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("auth.manageStaff")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("auth.staffNamePlaceholder")}
          placeholderTextColor="#6b7280"
          value={inviteStaffName}
          onChangeText={setInviteStaffName}
        />
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleGenerateInvite}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{t("auth.generateInviteLink")}</Text>
        </Pressable>
        {inviteLink ? (
          <Text style={styles.linkText} selectable>
            {inviteLink}
          </Text>
        ) : null}
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleSignOut}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{t("auth.signOut")}</Text>
      </Pressable>
    </View>
  );
}
