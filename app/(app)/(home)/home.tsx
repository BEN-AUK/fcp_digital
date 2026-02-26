import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { styles } from "./home.styles";

export default function QuickRecordScreen() {
  const { t } = useTranslation();
  return (
    <ScreenContainer style={styles.container}>
      <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>{t("tabs.quick_record")}</Text>
    </ScreenContainer>
  );
}
