import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./index.styles";

export default function ManageIndexScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <Pressable
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          onPress={() => router.push("/manage/staff")}
          accessibilityRole="button"
          accessibilityLabel={t("manage.manage_staff")}
        >
          <Ionicons name="people-outline" size={22} color="#374151" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>{t("manage.manage_staff")}</Text>
        </Pressable>
      </View>
    </View>
  );
}
