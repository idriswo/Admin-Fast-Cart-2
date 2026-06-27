import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import tj from './locales/tj.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

export const languages = [
  { code: 'tj', label: 'Тоҷикӣ' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tj: { translation: tj },
      ru: { translation: ru },
      en: { translation: en },
    },
    fallbackLng: 'tj',
    interpolation: { escapeValue: false },
    detection: { caches: ['localStorage'] },
  })

export default i18n
