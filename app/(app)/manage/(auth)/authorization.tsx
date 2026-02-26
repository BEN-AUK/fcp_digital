import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import Head from "expo-router/head";
import { styles } from "./authorization.styles";

export default function StaffAuthorizationScreen() {
  const { t } = useTranslation();

  const handleGenerateQRCode = () => {
    // TODO: 生成二维码逻辑
  };

  return (
    <>
      <Head>
        <title>{t("manage.authorise_staff")}</title>
      </Head>
      <View style={styles.container}>
        <Text style={styles.header}>{t("manage.authorise_staff")}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={handleGenerateQRCode}
          accessibilityRole="button"
          accessibilityLabel={t("manage.generate_qr_code")}
        >
          <Text style={styles.primaryButtonText}>
            {t("manage.generate_qr_code")}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
