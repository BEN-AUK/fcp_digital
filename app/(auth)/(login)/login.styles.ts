import { StyleSheet } from "react-native";

/** 核心路径按钮最小点击面积 60×60px (Kitchen-Ready UI) */
const MIN_BUTTON_SIZE = 60;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  button: {
    minWidth: MIN_BUTTON_SIZE,
    minHeight: MIN_BUTTON_SIZE,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 8,
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: "#fff", fontSize: 16 },
  linkWrap: {
    marginTop: 24,
    alignItems: "center",
    minHeight: 60,
    justifyContent: "center",
  },
  link: {
    color: "#2563eb",
    fontSize: 16,
  },
});
