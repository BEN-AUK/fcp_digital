import { StyleSheet } from "react-native";

/** 核心路径按钮最小点击面积 60×60px (Kitchen-Ready UI) */
const MIN_BUTTON_SIZE = 60;

/** Manage：从底部 Tab 向上弹出的菜单卡片，与 Tab 连在一起。 */
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  sheetGrabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
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
    opacity: 0.7,
  },
  menuItemIcon: {
    marginRight: 14,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  menuItemChevron: {
    marginLeft: 8,
  },
  cancelButton: {
    minHeight: MIN_BUTTON_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
});
