import { StyleSheet, type DimensionValue } from "react-native";
import { theme } from "@/styles/theme";

export const settingsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    height: "100dvh" as DimensionValue,
  },
  list: {
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    minHeight: theme.layout.touchableHeight,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.s,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.m,
  },
  rowLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  valueTouch: {
    minWidth: theme.layout.touchableHeight,
    minHeight: theme.layout.touchableHeight,
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: -theme.spacing.s,
    paddingRight: theme.spacing.s,
    paddingLeft: theme.spacing.m,
  },
  valueText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.l,
    borderTopRightRadius: theme.borderRadius.l,
    paddingBottom: theme.spacing.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  modalOption: {
    minHeight: theme.layout.touchableHeight,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalOptionLast: {
    borderBottomWidth: 0,
  },
  modalOptionText: {
    ...theme.typography.header,
    color: theme.colors.primary,
  },
});
