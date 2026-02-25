import { StyleSheet } from "react-native";

/** 核心路径按钮最小点击面积 60×60px (Kitchen-Ready UI) */
const MIN_BUTTON_SIZE = 60;

/** Staff 页（Modal）：授权员工列表与邀请。 */
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
    marginBottom: 16,
    color: "#000",
  },
  button: {
    minWidth: MIN_BUTTON_SIZE,
    minHeight: MIN_BUTTON_SIZE,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 24,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  listItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  listItemStatus: {
    fontSize: 14,
    color: "#6b7280",
  },
  listItemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemCopyButton: {
    minWidth: MIN_BUTTON_SIZE,
    minHeight: MIN_BUTTON_SIZE,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  listItemCopyButtonPressed: { opacity: 0.8 },
  listItemCopyButtonMargin: { marginRight: 8 },
  listItemRevokeButton: {
    minWidth: MIN_BUTTON_SIZE,
    minHeight: MIN_BUTTON_SIZE,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  listItemRevokeButtonPressed: { opacity: 0.8 },
  listItemButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
