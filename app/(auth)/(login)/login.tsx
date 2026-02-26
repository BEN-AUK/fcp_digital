import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useRouter, Link, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { useVenueAuth } from "@/auth/useVenueAuth";
import { theme } from "@/styles/theme";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { styles } from "./login.styles";

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn } = useVenueAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError(t("auth.errorEmailPasswordRequired"));
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/(app)/(home)/home" as Href);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("auth.errorSignInFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>{t("auth.venueLogin")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("auth.email")}
        placeholderTextColor={theme.colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder={t("auth.password")}
        placeholderTextColor={theme.colors.textMuted}
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
      <Link href={"/register" as const} asChild>
        <Pressable
          style={styles.linkWrap}
          accessibilityRole="link"
          disabled={loading}
        >
          <Text style={styles.link}>{t("auth.goToRegister")}</Text>
        </Pressable>
      </Link>
    </ScreenContainer>
  );
}
