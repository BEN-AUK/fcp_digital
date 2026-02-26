import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.l,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.l,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    ...theme.typography.body,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.m,
    ...theme.typography.caption,
  },
  button: {
    minHeight: theme.layout.touchableHeight,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.m,
    marginTop: theme.spacing.s,
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: {
    color: theme.colors.textOnDark,
    ...theme.typography.body,
    fontWeight: "600",
  },
  linkWrap: {
    marginTop: theme.spacing.l,
    alignItems: "center",
    minHeight: theme.layout.touchableHeight,
    justifyContent: "center",
  },
  link: {
    color: theme.colors.primary,
    ...theme.typography.body,
  },
});
