import { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { styles } from "./register.styles";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp } = useVenueAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return t("auth.errorPasswordTooShort");
    if (!/[a-zA-Z]/.test(pwd)) return t("auth.errorPasswordNoLetter");
    if (!/\d/.test(pwd)) return t("auth.errorPasswordNoNumber");
    return null;
  };

  const handleRegister = async () => {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError(t("auth.errorEmailPasswordRequired"));
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.errorPasswordMismatch"));
      return;
    }
    setLoading(true);
    try {
      await signUp(trimmedEmail, password, shopName.trim());
      router.replace("/(app)");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("auth.errorRegistrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("auth.registerTitle")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("auth.email")}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder={t("auth.shopName")}
          value={shopName}
          onChangeText={setShopName}
          autoComplete="off"
          editable={!loading}
        />
        <Text style={styles.hint}>{t("auth.passwordRules")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("auth.password")}
          value={password}
          onChangeText={setPassword}
          autoComplete="new-password"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder={t("auth.confirmPassword")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoComplete="new-password"
          editable={!loading}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleRegister}
          disabled={loading}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{t("auth.registerSubmit")}</Text>
        </Pressable>
        <Link href="/(auth)/login" asChild>
          <Pressable
            style={styles.linkWrap}
            accessibilityRole="link"
            disabled={loading}
          >
            <Text style={styles.link}>{t("auth.goToLogin")}</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
