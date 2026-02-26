import { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, ScrollView, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import Head from "expo-router/head";
import { useVenueStore } from "@/stores/venueStore";
import { subscribeActiveUsers, deactivateUser, type VenueUserRecord } from "@/auth/venueUsers";
import { styles } from "./staff.styles";

export default function ManageStaffScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const venue = useVenueStore((s) => s.venue);
  const [users, setUsers] = useState<VenueUserRecord[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      header: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    if (!venue?.venueId) return;
    const unsubscribe = subscribeActiveUsers(venue.venueId, setUsers);
    return unsubscribe;
  }, [venue?.venueId]);

  const handleRemove = (user: VenueUserRecord) => {
    const message = t("manage.remove_staff_confirm");
    const doDeactivate = () => {
      deactivateUser(user.staffId).catch(() => {});
    };
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm(message)) {
        doDeactivate();
      }
    } else {
      Alert.alert(
        t("manage.remove_staff"),
        message,
        [
          { text: t("common.cancel"), style: "cancel" },
          { text: t("manage.remove_staff"), style: "destructive", onPress: doDeactivate },
        ]
      );
    }
  };

  return (
    <>
      <Head>
        <title>{t("manage.manage_staff")}</title>
      </Head>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollSection}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.listTitle}>{t("manage.staff_list_title")}</Text>
          <View style={styles.list}>
            {users.map((user) => (
              <View key={user.staffId} style={styles.listItem}>
                <Text style={styles.listItemName}>{user.displayName || user.staffId}</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.listItemDeleteButton,
                    pressed && styles.listItemDeleteButtonPressed,
                  ]}
                  onPress={() => handleRemove(user)}
                  accessibilityRole="button"
                  accessibilityLabel={t("manage.remove_staff")}
                >
                  <Text style={styles.listItemButtonText}>{t("manage.remove_staff")}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
