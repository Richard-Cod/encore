import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "welcome": "Welcome to my app",
          "language": "Language",
          "change_language": "Change Language"
        }
      },
      fr: {
        translation: {
          "welcome": "Bienvenue dans mon application",
          "language": "Langue",
          "change_language": "Changer de langue"
        }
      }
    },
    lng: "en", // default language
    fallbackLng: "en", // fallback language
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;