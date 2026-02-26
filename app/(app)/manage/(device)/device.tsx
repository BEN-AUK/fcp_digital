import { View, Text } from "react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { styles } from "./device.styles";

export default function ManageDeviceScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>HELLO WORLD</Text>
    </ScreenContainer>
  );
}
