import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";
import type { StaffContext } from "@/types/auth";

const MIN_BUTTON_SIZE = 60;

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    minWidth: MIN_BUTTON_SIZE,
    minHeight: MIN_BUTTON_SIZE,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 8,
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: "#fff", fontSize: 16 },
});
