import { StyleSheet, Platform } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  outer: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: theme.colors.background,
    ...(Platform.OS === "web"
      ? {
          maxWidth: theme.layout.maxContentWidth,
          alignSelf: "center",
          width: "100%",
        }
      : {}),
  },
  inner: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
});
