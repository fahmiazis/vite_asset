import { create } from 'zustand'

interface modalsProps {
  isActive: boolean
  setIsActive: (val: boolean) => void
  resetModals: () => void
}

const STORAGE_KEY = 'sidebar-open'

/** Baca preferensi terakhir; default terbuka kalau belum pernah di-set */
const readStoredState = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === null ? true : stored === 'true'
  } catch {
    // private mode / site data diblokir
    return true
  }
}

const persistState = (isActive: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(isActive))
  } catch {
    // diabaikan — sidebar tetap jalan tanpa penyimpanan
  }
}

const sidebarStore = create<modalsProps>((set) => ({
  isActive: readStoredState(),
  setIsActive: (isActive) => {
    persistState(isActive)
    set({ isActive })
  },
  resetModals: () => {
    persistState(false)
    set({ isActive: false })
  },
}))

export default sidebarStore
