/**
 * Web signature — uses react-signature-canvas (native Canvas).
 * No WebView dependency; used when Platform.OS === 'web'.
 */
import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { View, Text, Pressable } from "react-native";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";
import { universalSignatureStyles } from "./index.styles";
import type { UniversalSignatureViewRef, UniversalSignatureProps } from "./types";
import { validateSignatureCanvas } from "./signatureValidation";

export const WebSignature = forwardRef<
  UniversalSignatureViewRef,
  UniversalSignatureProps
>(function WebSignature({ onOK, onEmpty, onTooSimple }, ref) {
  const { t } = useTranslation();
  const canvasRef = useRef<SignatureCanvas>(null);

  useImperativeHandle(ref, () => ({
    readSignature: () => {
      const pad = canvasRef.current;
      if (!pad) return;
      if (pad.isEmpty()) {
        onEmpty?.();
        return;
      }
      const trimmed = pad.getTrimmedCanvas();
      const dataUrl = trimmed.toDataURL("image/png");
      if (!validateSignatureCanvas(trimmed)) {
        // Web: Alert.alert with buttons is no-op; use window.confirm. OK = 确认继续, Cancel = 重签
        const continueAnyway =
          typeof window !== "undefined" &&
          window.confirm(t("auth.signature_too_simple_confirm"));
        if (continueAnyway) {
          onOK?.(dataUrl);
        } else {
          onTooSimple?.();
        }
        return;
      }
      onOK?.(dataUrl);
    },
    clearSignature: () => canvasRef.current?.clear(),
  }));

  const handleClear = () => canvasRef.current?.clear();

  return (
    <View>
      <View style={universalSignatureStyles.container}>
        <SignatureCanvas
          ref={canvasRef}
          canvasProps={{
            style: {
              width: "100%",
              height: 200,
              touchAction: "none",
            },
            className: "signature-canvas",
          }}
          backgroundColor="rgb(255, 255, 255)"
          penColor="rgb(0, 0, 0)"
          clearOnResize={false}
        />
      </View>
      <Pressable
        onPress={handleClear}
        style={({ pressed }) => [
          universalSignatureStyles.clearButton,
          pressed && { opacity: 0.7 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={t("auth.signatureClear")}
      >
        <Text style={universalSignatureStyles.clearButtonText}>
          {t("auth.signatureClear")}
        </Text>
      </Pressable>
    </View>
  );
});
