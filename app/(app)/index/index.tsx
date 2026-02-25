import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

export default function QuickRecordScreen() {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18, color: "#111827" }}>{t("tabs.quickRecord")}</Text>
    </View>
  );
}
