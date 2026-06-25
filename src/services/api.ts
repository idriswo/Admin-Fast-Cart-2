import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'

/**
 * Single axios instance. The base URL lives in .env (VITE_API_BASE_URL)
 * so it is never hard-coded into the published client bundle.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request: attach the bearer token to every request.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response: centralised error handling (401/403 -> login, toast messages).
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ errors?: string[]; title?: string }>) => {
    const status = error.response?.status
    const data = error.response?.data
    const hasToken = !!useAuthStore.getState().token

    if (status === 401 || status === 403) {
      if (!hasToken) {
        // Truly unauthenticated -> send to login.
        if (window.location.pathname !== '/login') {
          window.location.assign('/login')
        }
        toast.error('Лутфан ворид шавед.')
      } else {
        // Authenticated but lacking permission for this resource (e.g. admin-only).
        // Don't log the user out — just inform them.
        toast.error('Барои ин амал иҷозати кофӣ надоред (admin лозим аст).')
      }
    } else {
      const msg =
        data?.errors?.[0] ||
        data?.title ||
        error.message ||
        'Хатогии номаълум рух дод.'
      toast.error(msg)
    }
    return Promise.reject(error)
  }
)
