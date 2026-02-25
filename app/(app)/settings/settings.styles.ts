import { StyleSheet } from "react-native";

const MIN_TOUCH_SIZE = 60;

export const settingsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: "100dvh",
  },
  list: {
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 29,
    height: 29,
    borderRadius: 6,
    backgroundColor: "#E8E8ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    color: "#000000",
    fontWeight: "400",
  },
  /** Right-side control: minimum 60x60px tap area per non-negotiables */
  valueTouch: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: -8,
    paddingRight: 8,
    paddingLeft: 16,
  },
  valueText: {
    fontSize: 17,
    color: "#8E8E93",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingBottom: 34,
  },
  modalOption: {
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  modalOptionLast: {
    borderBottomWidth: 0,
  },
  modalOptionText: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "400",
  },
});
