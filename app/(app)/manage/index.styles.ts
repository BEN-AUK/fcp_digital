import { StyleSheet } from "react-native";

/** 核心路径按钮最小点击面积 60×60px (Kitchen-Ready UI) */
const MIN_BUTTON_SIZE = 60;

/** Manage 一级菜单页：列表菜单，白底 + 分割线清爽感。 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#fff",
  },
  menu: {
    width: "100%",
    alignItems: "stretch",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: MIN_BUTTON_SIZE,
    minWidth: MIN_BUTTON_SIZE,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  menuItemPressed: {
    opacity: 0.8,
  },
  menuItemIcon: {
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
});
