import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function ManageLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="staff"
        options={{
          title: "",
          presentation: "formSheet",
          sheetGrabberVisible: true,
          headerShown: false,
          header: () => null,
        }}
      />
    </Stack>
  );
}
