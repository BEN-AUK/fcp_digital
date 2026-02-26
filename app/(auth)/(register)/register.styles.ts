import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing.l,
    paddingVertical: theme.spacing.xl,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.l,
  },
  hint: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
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
