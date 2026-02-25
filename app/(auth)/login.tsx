import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { signInVenue } from "@/auth/useVenueAuth";

const MIN_BUTTON_SIZE = 60;

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Email and password required");
      return;
    }
    setLoading(true);
    try {
      await signInVenue(email.trim(), password);
      router.replace("/(auth)/staff");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("auth.venueLogin")}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleSignIn}
        disabled={loading}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{t("common.confirm")}</Text>
      </Pressable>
    </View>
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
  error: {
    color: "red",
    marginBottom: 12,
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
