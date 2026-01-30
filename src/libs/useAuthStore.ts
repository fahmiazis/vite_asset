import { create } from 'zustand'
import { getToken, removeToken, setToken } from './cookies'

type AuthState = {
  token: string | null
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken() ?? null,

  setToken: (token) => {
    set({ token })
    setToken(token)
  },

  logout: () => {
    removeToken()
    set({ token: null })
  },
}))
