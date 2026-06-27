import { api } from './api'
import type { Brand } from '@/types'

export async function getBrands() {
  const { data } = await api.get('/Brand/get-brands')
  const raw = data?.data ?? data
  return (Array.isArray(raw) ? raw : []) as Brand[]
}

// Brand endpoints take their data via query params (no body, no image).
export async function addBrand(payload: { name: string }) {
  const { data } = await api.post('/Brand/add-brand', null, {
    params: { BrandName: payload.name },
  })
  return data
}

export async function updateBrand(payload: { id: number; name: string }) {
  const { data } = await api.put('/Brand/update-brand', null, {
    params: { Id: payload.id, BrandName: payload.name },
  })
  return data
}

export async function deleteBrand(id: number) {
  const { data } = await api.delete('/Brand/delete-brand', { params: { id } })
  return data
}
