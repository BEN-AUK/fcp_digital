import { useState } from "react";
import { View, Text, Pressable, Modal, type ViewStyle, type TextStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore, type LanguageCode } from "@/stores/settingsStore";
import { settingsStyles } from "./settings.styles";

const LANGUAGE_OPTIONS: { code: LanguageCode; label: string }[] = [
  { code: "en-NZ", label: "English (NZ)" },
  { code: "zh", label: "简体中文" },
];

function getLanguageLabel(code: LanguageCode): string {
  return LANGUAGE_OPTIONS.find((o) => o.code === code)?.label ?? code;
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setPickerVisible(false);
  };

  return (
    <View style={settingsStyles.screen as ViewStyle}>
      <View style={settingsStyles.list as ViewStyle}>
        <View style={settingsStyles.row as ViewStyle}>
          <View style={settingsStyles.rowLeft as ViewStyle}>
            <View style={settingsStyles.iconWrap as ViewStyle}>
              <Ionicons name="language" size={18} color="#000000" />
            </View>
            <Text style={settingsStyles.rowLabel as TextStyle}>{t("settings.language")}</Text>
          </View>
          <Pressable
            style={settingsStyles.valueTouch as ViewStyle}
            onPress={() => setPickerVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t("settings.select_language")}
          >
            <Text style={settingsStyles.valueText as TextStyle} numberOfLines={1}>
              {getLanguageLabel(language)}
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable
          style={settingsStyles.modalBackdrop as ViewStyle}
          onPress={() => setPickerVisible(false)}
        >
          <Pressable style={settingsStyles.modalSheet as ViewStyle} onPress={(e) => e.stopPropagation()}>
            {LANGUAGE_OPTIONS.map((opt, i) => (
              <Pressable
                key={opt.code}
                style={[
                  settingsStyles.modalOption as ViewStyle,
                  i === LANGUAGE_OPTIONS.length - 1 && (settingsStyles.modalOptionLast as ViewStyle),
                ]}
                onPress={() => handleSelect(opt.code)}
              >
                <Text style={settingsStyles.modalOptionText as TextStyle}>{opt.label}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
