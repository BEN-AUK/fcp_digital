import React, { forwardRef } from "react";
import { View, Text, Pressable } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import type { SignatureViewRef } from "react-native-signature-canvas";
import { useTranslation } from "react-i18next";
import { signatureCanvasStyles } from "./index.styles";

export type { SignatureViewRef };

type SignatureCanvasProps = {
  onOK?: (signature: string) => void;
  onEmpty?: () => void;
};

export const SignatureCanvas = forwardRef<SignatureViewRef, SignatureCanvasProps>(
  function SignatureCanvas({ onOK, onEmpty }, ref) {
    const { t } = useTranslation();

    const handleClear = () => {
      if (typeof ref !== "function" && ref?.current) {
        ref.current.clearSignature();
      }
    };

    return (
      <View>
        <View style={signatureCanvasStyles.container}>
          <SignatureScreen
            ref={ref}
            onOK={onOK}
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
            signatureCanvasStyles.clearButton,
            pressed && { opacity: 0.7 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("auth.signatureClear")}
        >
          <Text style={signatureCanvasStyles.clearButtonText}>
            {t("auth.signatureClear")}
          </Text>
        </Pressable>
      </View>
    );
  }
);
