import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

/** Manage：从底部 Tab 向上弹出的菜单卡片，工业高能效深色主题。 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "transparent",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetOuter: {
    width: "100%",
    alignItems: "center",
  },
  sheet: {
    width: "100%",
    borderTopLeftRadius: theme.borderRadius.l,
    borderTopRightRadius: theme.borderRadius.l,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: theme.colors.border,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sheetGrabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textMuted,
    alignSelf: "center",
    marginBottom: theme.spacing.m,
  },
  sheetTitle: {
    ...theme.typography.header,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.m,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: theme.layout.touchableHeight,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemIcon: {
    marginRight: theme.spacing.m,
  },
  menuItemText: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  menuItemChevron: {
    marginLeft: theme.spacing.s,
  },
  cancelButton: {
    minHeight: theme.layout.touchableHeight,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
});
