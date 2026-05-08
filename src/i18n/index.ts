import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import id from './locales/id.json'
import en from './locales/en.json'
import zh from './locales/zh.json'
import th from './locales/th.json'
import vn from './locales/vn.json'

const savedLang = JSON.parse(localStorage.getItem('app-language') || '{}')?.state?.language || 'id'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: id },
      en: { translation: en },
      zh: { translation: zh },
      th: { translation: th },
      vn: { translation: vn },
    },
    lng: savedLang,
    fallbackLng: 'id',
    interpolation: { escapeValue: false },
  })

export default i18n