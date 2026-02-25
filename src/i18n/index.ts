import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import enNZ from "./locales/en-NZ.json";

const resources = {
  en: { translation: en },
  "en-NZ": { translation: enNZ },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en-NZ",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
