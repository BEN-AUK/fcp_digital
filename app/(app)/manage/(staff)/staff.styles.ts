import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

/** Staff 页：当前场馆在岗员工列表，每行姓名 + 移除按钮。工业高能效：surface 卡片、12px 圆角、72–80px 行高。 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: theme.colors.background,
  },
  scrollSection: {
    width: "100%",
    flex: 1,
  },
  scrollContent: {
    alignItems: "stretch",
    paddingBottom: theme.spacing.l,
  },
  listTitle: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  list: {
    width: "100%",
    flexGrow: 0,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 72,
    maxHeight: 80,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemLeft: {
    flex: 1,
    marginRight: theme.spacing.m,
    justifyContent: "center",
  },
  listItemName: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  listItemDeleteButton: {
    minWidth: theme.layout.touchableHeight,
    minHeight: theme.layout.touchableHeight,
    backgroundColor: theme.colors.danger,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.m,
  },
  listItemDeleteButtonPressed: {
    opacity: 0.8,
  },
  listItemButtonText: {
    color: theme.colors.textOnDark,
    ...theme.typography.caption,
  },
});
