import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userName: string | null
  setAuth: (token: string, userName: string) => void
  logout: () => void
}

/** Global auth store — token persisted to localStorage. */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      setAuth: (token, userName) => {
        // Persist the raw JWT under a plain `token` key too, so it can be read
        // outside the store (DevTools / other tooling).
        localStorage.setItem('token', token)
        set({ token, userName })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ token: null, userName: null })
      },
    }),
    { name: 'fastcart-auth' }
  )
)
