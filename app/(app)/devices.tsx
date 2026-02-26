import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { styles } from "./devices.styles";

export default function DeviceManagementScreen() {
  const router = useRouter();

  const handleAddDevice = () => {
    router.push("/(app)/add-device-scanner");
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Device Management</Text>
      <Pressable
        style={({ pressed }) => [styles.mainButton, pressed && styles.mainButtonPressed]}
        onPress={handleAddDevice}
        accessibilityRole="button"
        accessibilityLabel="Add New Device"
      >
        <Text style={styles.mainButtonText}>Add New Device</Text>
      </Pressable>
    </ScreenContainer>
  );
}
