import { StyleSheet, Platform } from "react-native";
import { theme } from "@/styles/theme";

const CAPTURE_BUTTON_SIZE = 70;
const FOCUS_FRAME_SIZE = 240;

/** Add Device Scanner: 黑色背景，相机预览 + 对焦框，底部操作区。 */
export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#000000",
  },
  cameraSection: {
    flex: 8,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    ...(Platform.OS === "web" ? { aspectRatio: 3 / 4 } : {}),
  },
  focusFrameOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  focusFrame: {
    width: FOCUS_FRAME_SIZE,
    height: FOCUS_FRAME_SIZE,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: theme.borderRadius.m,
    backgroundColor: "transparent",
  },
  bottomSection: {
    flex: 2,
    width: "100%",
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.m,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  hint: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textOnDark,
    textAlign: "center",
    marginBottom: theme.spacing.s,
    paddingHorizontal: theme.spacing.s,
  },
  switchButton: {
    minHeight: theme.layout.touchableHeight,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.textOnDark,
    backgroundColor: "transparent",
    borderRadius: theme.borderRadius.m,
  },
  switchButtonPressed: {
    opacity: 0.8,
  },
  switchButtonText: {
    ...theme.typography.body,
    color: theme.colors.textOnDark,
    fontWeight: "500",
  },
  captureButtonOuter: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: 4,
    borderColor: theme.colors.textOnDark,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: theme.spacing.m,
  },
  captureButtonInner: {
    width: CAPTURE_BUTTON_SIZE - 20,
    height: CAPTURE_BUTTON_SIZE - 20,
    borderRadius: (CAPTURE_BUTTON_SIZE - 20) / 2,
    backgroundColor: theme.colors.textOnDark,
  },
  captureButtonPressed: {
    opacity: 0.8,
  },

  // Permission (no camera) state
  permissionContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.l,
  },
  permissionMessage: {
    ...theme.typography.body,
    color: theme.colors.textOnDark,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l,
  },
  grantButton: {
    minHeight: theme.layout.mainButtonHeight,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.textOnDark,
    backgroundColor: "transparent",
    borderRadius: theme.borderRadius.m,
  },
  grantButtonPressed: {
    opacity: 0.8,
  },
  grantButtonText: {
    ...theme.typography.body,
    color: theme.colors.textOnDark,
    fontWeight: "600",
  },
});
