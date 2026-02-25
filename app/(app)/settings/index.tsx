import { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
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
    <View style={settingsStyles.screen}>
      <View style={settingsStyles.list}>
        <View style={settingsStyles.row}>
          <View style={settingsStyles.rowLeft}>
            <View style={settingsStyles.iconWrap}>
              <Ionicons name="language" size={18} color="#000000" />
            </View>
            <Text style={settingsStyles.rowLabel}>{t("settings.language")}</Text>
          </View>
          <Pressable
            style={settingsStyles.valueTouch}
            onPress={() => setPickerVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t("settings.select_language")}
          >
            <Text style={settingsStyles.valueText} numberOfLines={1}>
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
          style={settingsStyles.modalBackdrop}
          onPress={() => setPickerVisible(false)}
        >
          <Pressable style={settingsStyles.modalSheet} onPress={(e) => e.stopPropagation()}>
            {LANGUAGE_OPTIONS.map((opt, i) => (
              <Pressable
                key={opt.code}
                style={[
                  settingsStyles.modalOption,
                  i === LANGUAGE_OPTIONS.length - 1 && settingsStyles.modalOptionLast,
                ]}
                onPress={() => handleSelect(opt.code)}
              >
                <Text style={settingsStyles.modalOptionText}>{opt.label}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
