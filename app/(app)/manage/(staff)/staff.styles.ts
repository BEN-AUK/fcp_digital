import { StyleSheet } from "react-native";

/** 核心路径按钮最小点击面积 60×60px (Kitchen-Ready UI) */
const MIN_BUTTON_SIZE = 60;

/** Staff 页：当前场馆在岗员工列表，每行姓名 + 移除按钮（软删除 isActive=false）。 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  scrollSection: {
    width: "100%",
    maxWidth: 400,
  },
  scrollContent: {
    alignItems: "stretch",
    paddingBottom: 24,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 24,
    marginBottom: 12,
  },
  list: {
    width: "100%",
    flexGrow: 0,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  listItemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  listItemDeleteButton: {
    minWidth: MIN_BUTTON_SIZE,
    minHeight: MIN_BUTTON_SIZE,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  listItemDeleteButtonPressed: {
    opacity: 0.8,
  },
  listItemButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
