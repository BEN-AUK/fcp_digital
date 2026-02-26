import { StyleSheet } from "react-native";

/** 核心路径按钮最小点击面积 60×60px (Kitchen-Ready UI) */
const MIN_BUTTON_SIZE = 60;

/** 员工授权页：顶部标题 + 生成二维码按钮，风格与 Authorise staff 参考图一致。 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerContent: {
    alignItems: "center",
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    minWidth: MIN_BUTTON_SIZE,
    minHeight: MIN_BUTTON_SIZE,
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  primaryButtonPressed: {
    opacity: 0.8,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkSection: {
    width: "100%",
    maxWidth: 400,
    marginTop: 24,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  qrSection: {
    width: "100%",
    maxWidth: 400,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
