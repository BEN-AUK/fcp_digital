import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function ManageLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="manage"
        options={{
          headerShown: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="(staff)/staff"
        options={{
          title: "",
          presentation: "formSheet",
          sheetGrabberVisible: true,
          headerShown: false,
          header: () => null,
        }}
      />
      <Stack.Screen
        name="(auth)/authorization"
        options={{
          title: "",
          presentation: "formSheet",
          sheetGrabberVisible: true,
          headerShown: false,
          header: () => null,
        }}
      />
      <Stack.Screen
        name="(device)/device"
        options={{
          title: "",
          presentation: "formSheet",
          sheetGrabberVisible: true,
          headerShown: false,
          header: () => null,
        }}
      />
      <Stack.Screen
        name="add-device-scanner"
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
