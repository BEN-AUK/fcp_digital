import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useVenueStore } from "@/stores/venueStore";
import { useStaffStore } from "@/stores/staffStore";
import { signOutVenue } from "@/auth/useVenueAuth";

const MIN_BUTTON_SIZE = 60;

export default function AppHomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const venue = useVenueStore((s) => s.venue);
  const staff = useStaffStore((s) => s.staff);

  const handleSignOut = async () => {
    await signOutVenue();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Venue: {venue?.venueId ?? "—"}</Text>
      <Text style={styles.text}>Staff: {staff?.displayName ?? "—"} ({staff?.staffId})</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    minWidth: MIN_BUTTON_SIZE,
    minHeight: MIN_BUTTON_SIZE,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 24,
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: "#fff", fontSize: 16 },
});
