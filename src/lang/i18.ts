import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./en/translation.json";
import translationFR from "./fr/translation.json";

// Configuration de la langue par défaut et des ressources
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    fr: { translation: translationFR },
  },
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false, // React gère déjà l'échappement des valeurs
  },
});

export default i18n;
