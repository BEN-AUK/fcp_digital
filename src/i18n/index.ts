import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import enNZ from "./locales/en-NZ.json";
import zh from "./locales/zh.json";

const resources = {
  en: { translation: en },
  "en-NZ": { translation: enNZ },
  zh: { translation: zh },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en-NZ",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
