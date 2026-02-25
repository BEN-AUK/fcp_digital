import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";
import type { StaffContext } from "@/types/auth";
import { styles } from "./staff.styles";

export default function StaffScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const venue = useVenueStore((s) => s.venue);
  const setStaff = useStaffStore((s) => s.setStaff);

  const handleConfirm = (staffId: string, displayName: string) => {
    if (!venue) return;
    const context: StaffContext = {
      staffId: staffId.trim() || displayName.trim(),
      displayName: displayName.trim() || staffId.trim(),
      venueId: venue.venueId,
    };
    setStaff(context);
    router.replace("/(app)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("auth.staffSelect")}</Text>
      <StaffForm onSubmit={handleConfirm} />
    </View>
  );
}

function StaffForm({
  onSubmit,
}: {
  onSubmit: (staffId: string, displayName: string) => void;
}) {
  const { t } = useTranslation();
  const [staffId, setStaffId] = useState("");
  const [displayName, setDisplayName] = useState("");

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Staff ID"
        value={staffId}
        onChangeText={setStaffId}
      />
      <TextInput
        style={styles.input}
        placeholder="Display name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => onSubmit(staffId, displayName)}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{t("common.confirm")}</Text>
      </Pressable>
    </>
  );
}
