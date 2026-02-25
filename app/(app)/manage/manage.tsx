import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter, useNavigation, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./manage.styles";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ManageIndexScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useFocusEffect(
    useCallback(() => {
      setShowMenu(true);
    }, [])
  );

  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;
    const unsub = (parent as { addListener: (e: string, cb: () => void) => () => void }).addListener("tabPress", () => {
      setShowMenu(true);
    });
    return unsub;
  }, [navigation]);

  useEffect(() => {
    if (showMenu) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showMenu, slideAnim]);

  const handleOpenStaff = () => {
    setShowMenu(false);
    router.push("/manage/staff");
  };

  const handleDismiss = () => {
    setShowMenu(false);
  };

  return (
    <>
      <View style={styles.container} />

      <Modal
        visible={showMenu}
        transparent
        animationType="none"
        onRequestClose={handleDismiss}
      >
        <Pressable style={styles.overlay} onPress={handleDismiss}>
          <Pressable
            style={styles.sheetOuter}
            onPress={(e) => e.stopPropagation()}
          >
            <Animated.View
              style={[
                styles.sheet,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.sheetGrabber} />
              <Text style={styles.sheetTitle}>{t("tabs.management")}</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleOpenStaff}
                accessibilityRole="button"
                accessibilityLabel={t("manage.manage_staff")}
              >
                <Ionicons
                  name="people-outline"
                  size={22}
                  color="#374151"
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>
                  {t("manage.manage_staff")}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                  style={styles.menuItemChevron}
                />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                ]}
                onPress={handleDismiss}
                accessibilityRole="button"
                accessibilityLabel={t("common.cancel")}
              >
                <Text style={styles.cancelButtonText}>
                  {t("common.cancel")}
                </Text>
              </Pressable>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
