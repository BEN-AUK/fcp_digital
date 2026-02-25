import { StyleSheet } from "react-native";

export const universalSignatureStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C6C6C8",
    borderRadius: 8,
    overflow: "hidden",
  },
  /** Clear button: ≥60px tap area per non-negotiables */
  clearButton: {
    minWidth: 60,
    minHeight: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
});
