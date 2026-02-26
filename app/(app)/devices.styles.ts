import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

/** Device Management: 设备管理主页，灰白背景、居中标题与主操作按钮。 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.l,
    justifyContent: "space-between",
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
  mainButton: {
    minHeight: theme.layout.mainButtonHeight,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.xl,
  },
  mainButtonPressed: {
    opacity: 0.8,
  },
  mainButtonText: {
    color: theme.colors.textOnDark,
    ...theme.typography.body,
    fontWeight: "600",
  },
});
