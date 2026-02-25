import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TAB_ACTIVE = "#7F57F1";
const TAB_INACTIVE = "#999999";

function TabIcon({
  name,
  focused,
  ...rest
}: { name: keyof typeof Ionicons.glyphMap; focused: boolean } & React.ComponentProps<typeof Ionicons>) {
  const color = focused ? TAB_ACTIVE : TAB_INACTIVE;
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Ionicons name={name} size={24} color={color} {...rest} />
      {focused && (
        <View
          style={{
            width: 24,
            height: 2,
            backgroundColor: TAB_ACTIVE,
            marginTop: 4,
            borderRadius: 1,
          }}
        />
      )}
    </View>
  );
}

export default function AppLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: TAB_ACTIVE,
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.quickRecord"),
          tabBarLabel: t("tabs.quickRecord"),
          tabBarIcon: ({ focused }) => <TabIcon name="pencil" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarLabel: t("tabs.settings"),
          tabBarIcon: ({ focused }) => <TabIcon name="settings-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: t("tabs.manage"),
          tabBarLabel: t("tabs.manage"),
          tabBarIcon: ({ focused }) => <TabIcon name="clipboard-outline" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
