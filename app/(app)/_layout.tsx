/**
 * 受保护分组 (app)：仅负责 Tab 与内部路由。
 * 鉴权与强制重定向由根目录 app/_layout.tsx 统一处理，此处不包含登录/登出跳转逻辑。
 */
import { useEffect } from "react";
import { Tabs, usePathname, Redirect } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useVenueStore } from "@/stores/venueStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { theme } from "@/styles/theme";
import i18n from "@/i18n";

const ICON_SIZE = 24;

const tabIconStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    width: 24,
    height: 2,
    backgroundColor: theme.colors.tabBarActive,
    marginTop: theme.spacing.xs,
    borderRadius: 1,
  },
});

function TabIcon({
  name,
  focused,
}: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  const color = focused ? theme.colors.tabBarActive : theme.colors.tabBarInactive;
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
  const insets = useSafeAreaInsets();
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

  const tabBarHeight = 60 + insets.bottom;
  const isScannerScreen =
    pathname?.includes("add-device-scanner") === true ||
    (typeof window !== "undefined" && window.location?.pathname?.includes("add-device-scanner"));
  const tabBarStyle = isScannerScreen
    ? { display: "none" as const }
    : {
        height: tabBarHeight,
        paddingTop: theme.spacing.s,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.tabBarBackground,
        borderTopWidth: 0,
      };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarLabelPosition: "below-icon",
        tabBarStyle,
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: theme.spacing.xs,
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
          href: (isVenueOwner ? "/manage/manage" : null) as "/manage/manage" | null,
        }}
      />
      <Tabs.Screen name="devices" options={{ href: null }} />
      <Tabs.Screen name="add-device-scanner" options={{ href: null }} />
    </Tabs>
  );
}
