import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/en';
import es from './locales/es/es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      es,
    },
    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },

  });

export default i18n;