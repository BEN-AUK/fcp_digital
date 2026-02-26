import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Head from "expo-router/head";
import { styles } from "./authorization.styles";

export default function StaffAuthorizationScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("manage.staff_authorization")}</title>
      </Head>
      <View style={styles.container}>
        <Text style={styles.title}>{t("manage.staff_authorization")}</Text>
      </View>
    </>
  );
}
