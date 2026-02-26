import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

/** 员工授权页：标题 + 生成二维码按钮，工业高能效主题。 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  containerContent: {
    alignItems: "center",
    padding: theme.spacing.l,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.l,
  },
  primaryButton: {
    minHeight: theme.layout.touchableHeight,
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.m,
  },
  primaryButtonPressed: {
    opacity: 0.8,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: theme.colors.textOnDark,
    ...theme.typography.body,
    fontWeight: "600",
  },
  linkSection: {
    width: "100%",
    maxWidth: 400,
    marginTop: theme.spacing.l,
  },
  linkLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  linkText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  qrSection: {
    width: "100%",
    maxWidth: 400,
    marginTop: theme.spacing.l,
    alignItems: "center",
    justifyContent: "center",
  },
});
