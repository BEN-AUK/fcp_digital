import { StyleSheet, type DimensionValue } from "react-native";

const MIN_BUTTON_HEIGHT = 60;

export const joinStyles = StyleSheet.create({
  screen: {
    flex: 1,
    height: "100dvh" as DimensionValue,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  errorBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C6C6C8",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 48,
  },
  signatureSection: {
    marginBottom: 24,
  },
  submitButton: {
    minHeight: MIN_BUTTON_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  submitError: {
    marginTop: 12,
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    zIndex: 10,
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34C759",
  },
});
