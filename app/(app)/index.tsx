import { View, Text } from "react-native";
import { styles } from "./index.styles";

export default function AppHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>HELLO WORLD - Venue Owner Authenticated</Text>
    </View>
  );
}
