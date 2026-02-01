import { create } from 'zustand'

interface modalsProps {
  isActive: boolean
  setIsActive: (val: boolean) => void
  resetModals: () => void
}

const sidebarStore = create<modalsProps>((set) => ({
  isActive: false,
  setIsActive: (isActive) => set({ isActive }),
  resetModals: () => set({ isActive: false }),
}))

export default sidebarStore
