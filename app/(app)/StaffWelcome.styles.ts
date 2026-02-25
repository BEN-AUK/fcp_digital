import { StyleSheet } from "react-native";

/** Staff welcome: full-viewport centred, large font. Mirrors StaffWelcome.module.css for RN. */
export const staffWelcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  message: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 38,
    color: "#1a1a1a",
  },
});
