import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./add-device-scanner.styles";

const BOTTOM_BUTTON_EXTRA_MARGIN = 20;

export default function AddDeviceScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();

  if (permission == null) {
    return (
      <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
        <View style={styles.pageInner} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer} edges={["top", "bottom"]}>
        <Text style={styles.permissionMessage}>
          Camera access is needed to scan the equipment compliance plate.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.grantButton, pressed && styles.grantButtonPressed]}
          onPress={requestPermission}
          accessibilityRole="button"
          accessibilityLabel="Grant Camera Permission"
        >
          <Text style={styles.grantButtonText}>Grant Camera Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleSwitchToManual = () => {
    console.log("[AddDeviceScanner] Switch to Manual Entry pressed");
  };

  const handleCapture = () => {
    console.log("[AddDeviceScanner] Capture / take photo pressed");
  };

  const controlsPaddingBottom = insets.bottom + BOTTOM_BUTTON_EXTRA_MARGIN;

  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <View style={styles.pageInner}>
        <View style={styles.cameraSection}>
          <CameraView style={styles.camera} facing="back" />
          <View style={styles.focusFrameOverlay}>
            <View style={styles.focusFrame} />
          </View>
        </View>
        <View style={[styles.bottomSection, { paddingBottom: controlsPaddingBottom }]}>
          <Text style={styles.hint}>
            Align the camera with the equipment&apos;s compliance plate
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.captureButtonOuter,
              pressed && styles.captureButtonPressed,
            ]}
            onPress={handleCapture}
            accessibilityRole="button"
            accessibilityLabel="Take photo"
          >
            <View style={styles.captureButtonInner} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.switchButton, pressed && styles.switchButtonPressed]}
            onPress={handleSwitchToManual}
            accessibilityRole="button"
            accessibilityLabel="Switch to Manual Entry"
          >
            <Text style={styles.switchButtonText}>Switch to Manual Entry</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
