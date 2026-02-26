import { StyleSheet, type DimensionValue } from "react-native";
import { theme } from "@/styles/theme";

export const joinStyles = StyleSheet.create({
  screen: {
    flex: 1,
    height: "100dvh" as DimensionValue,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.l,
  },
  errorBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.l,
  },
  errorText: {
    ...theme.typography.header,
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.l,
  },
  loadingText: {
    marginTop: theme.spacing.m,
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.l,
  },
  fieldLabel: {
    ...theme.typography.body,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    fontSize: 16,
    marginBottom: theme.spacing.l,
    minHeight: theme.layout.touchableHeight,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  signatureSection: {
    marginBottom: theme.spacing.l,
  },
  submitButton: {
    minHeight: theme.layout.touchableHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.l,
    paddingVertical: theme.spacing.m,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...theme.typography.header,
    color: theme.colors.textOnDark,
  },
  submitError: {
    marginTop: theme.spacing.m,
    ...theme.typography.caption,
    color: theme.colors.danger,
    textAlign: "center",
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    zIndex: 10,
  },
  successText: {
    ...theme.typography.header,
    color: theme.colors.success,
  },
});
