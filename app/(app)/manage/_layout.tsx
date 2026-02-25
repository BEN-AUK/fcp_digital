import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function ManageLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{ title: t("tabs.management") }}
      />
      <Stack.Screen
        name="staff"
        options={{
          presentation: "modal",
          title: t("manage.manage_staff"),
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
