import { api } from './api'
import type { Color } from '@/types'

export async function getColors() {
  const { data } = await api.get('/Color/get-colors')
  return (data?.data ?? data ?? []) as Color[]
}
