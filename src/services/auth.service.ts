import { api } from './api'
import type { LoginRequest } from '@/types'

interface LoginResult {
  token: string
  userName: string
}

/** Authenticate against /Account/login and normalise the token field. */
export async function login(body: LoginRequest): Promise<LoginResult> {
  const { data } = await api.post('/Account/login', body)
  // The API may wrap the token under `data` or return it directly.
  const token: string =
    data?.data?.token ?? data?.token ?? data?.data ?? data
  return { token, userName: body.userName }
}
