import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

const browserLanguage = navigator.language.split('-')[0]; 
console.log("Detected browser language:", browserLanguage);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: browserLanguage, 
  fallbackLng: 'en', 
  interpolation: { escapeValue: false },
});

export default i18n;
