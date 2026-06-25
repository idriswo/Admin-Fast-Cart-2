import { api } from './api'
import type { SubCategory } from '@/types'

export async function getSubCategories() {
  const { data } = await api.get('/SubCategory/get-sub-category')
  return (data?.data ?? data ?? []) as SubCategory[]
}
