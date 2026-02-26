import { View, Text, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { styles } from "./add-device-scanner.styles";

export default function AddDeviceScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (permission == null) {
    return <View style={styles.page} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
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
      </View>
    );
  }

  const handleSwitchToManual = () => {
    console.log("[AddDeviceScanner] Switch to Manual Entry pressed");
  };

  const handleCapture = () => {
    console.log("[AddDeviceScanner] Capture / take photo pressed");
  };

  return (
    <View style={styles.page}>
      <View style={styles.cameraSection}>
        <CameraView style={styles.camera} facing="back" />
        <View style={styles.focusFrameOverlay}>
          <View style={styles.focusFrame} />
        </View>
      </View>
      <View style={styles.bottomSection}>
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
  );
}
