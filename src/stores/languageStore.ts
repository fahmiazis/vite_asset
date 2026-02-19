import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n'
type Lang = 'id' | 'en'

interface LanguageStore {
  language: Lang
  setLanguage: (lang: Lang) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'id',
      setLanguage: (lang) => {
        i18n.changeLanguage(lang)
        set({ language: lang })
      },
    }),
    {
      name: 'app-language', // key di localStorage
    }
  )
)