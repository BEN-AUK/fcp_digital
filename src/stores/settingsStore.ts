import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/i18n";

const SETTINGS_STORAGE_KEY = "fcp_settings";

export type LanguageCode = "en-NZ" | "zh";

type SettingsState = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "en-NZ",
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
