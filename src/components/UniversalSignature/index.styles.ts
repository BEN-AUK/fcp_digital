import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const universalSignatureStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    overflow: "hidden",
  },
  /** Clear button: ≥ touchableHeight tap area per non-negotiables */
  clearButton: {
    minWidth: theme.layout.touchableHeight,
    minHeight: theme.layout.touchableHeight,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  clearButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "500",
  },
});
