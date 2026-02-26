import { useEffect } from "react";
import { Tabs, usePathname, Redirect } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVenueStore } from "@/stores/venueStore";
import { useSettingsStore } from "@/stores/settingsStore";
import i18n from "@/i18n";

const TAB_ACTIVE = "#7F57F1";
const TAB_INACTIVE = "#999999";
const ICON_SIZE = 24;

const tabIconStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    width: 24,
    height: 2,
    backgroundColor: TAB_ACTIVE,
    marginTop: 4,
    borderRadius: 1,
  },
});

function TabIcon({
  name,
  focused,
}: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  const color = focused ? TAB_ACTIVE : TAB_INACTIVE;
  return (
    <View style={tabIconStyles.wrapper}>
      <Ionicons name={name} size={ICON_SIZE} color={color} />
      {focused && <View style={tabIconStyles.indicator} />}
    </View>
  );
}

export default function AppLayout() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isVenueOwner = useVenueStore((s) => s.isAuthenticated);
  const language = useSettingsStore((s) => s.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // 访问 /(app) 无子路径时重定向到首页，避免 Unmatched Route
  const isAppRoot =
    pathname === "/(app)" ||
    (typeof window !== "undefined" && window.location?.pathname === "/(app)");
  if (isAppRoot) {
    return <Redirect href="/(app)/(home)/home" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TAB_ACTIVE,
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarStyle: {
          height: 80,
          paddingBottom: 24,
          paddingTop: 10,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
      }}
      initialRouteName="(home)/home"
    >
      <Tabs.Screen
        name="(home)/home"
        options={{
          title: t("tabs.quick_record"),
          tabBarLabel: t("tabs.quick_record"),
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
          headerShown: false,
          title: t("tabs.management"),
          tabBarLabel: t("tabs.management"),
          tabBarIcon: ({ focused }) => <TabIcon name="clipboard-outline" focused={focused} />,
          href: isVenueOwner ? "/manage" : null,
        }}
      />
    </Tabs>
  );
}
