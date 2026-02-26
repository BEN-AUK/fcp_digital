/**
 * Native (iOS/Android) signature — uses react-native-signature-canvas (WebView).
 * Only loaded when Platform.OS !== 'web' to avoid pulling in react-native-webview on web.
 */
import React, { forwardRef } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import type { SignatureViewRef } from "react-native-signature-canvas";
import { useTranslation } from "react-i18next";
import { universalSignatureStyles } from "./index.styles";
import type { UniversalSignatureViewRef, UniversalSignatureProps } from "./types";
import { validateSignatureBase64 } from "./signatureValidation";

export const NativeSignature = forwardRef<
  UniversalSignatureViewRef,
  UniversalSignatureProps
>(function NativeSignature({ onOK, onEmpty, onTooSimple }, ref) {
  const { t } = useTranslation();
  const nativeRef = React.useRef<SignatureViewRef>(null);

  const handleOK = React.useCallback(
    (signature: string) => {
      if (!validateSignatureBase64(signature)) {
        Alert.alert(
          "",
          t("auth.signature_too_simple_confirm"),
          [
            { text: t("auth.signature_resign"), onPress: () => onTooSimple?.() },
            { text: t("auth.signature_continue_anyway"), onPress: () => onOK?.(signature) },
          ]
        );
        return;
      }
      onOK?.(signature);
    },
    [onOK, onTooSimple, t]
  );

  React.useImperativeHandle(ref, () => ({
    readSignature: () => nativeRef.current?.readSignature(),
    clearSignature: () => nativeRef.current?.clearSignature(),
  }));

  const handleClear = () => nativeRef.current?.clearSignature();

  return (
    <View>
      <View style={universalSignatureStyles.container}>
        <SignatureScreen
          ref={nativeRef}
          onOK={handleOK}
          onEmpty={onEmpty}
          descriptionText=""
          clearText=""
          confirmText=""
          backgroundColor="rgb(255, 255, 255)"
          penColor="rgb(0, 0, 0)"
          imageType="image/png"
          trimWhitespace
          style={{ flex: 1, width: "100%", height: "100%" }}
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
