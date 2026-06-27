import { api } from './api'
import type { Color } from '@/types'

export async function getColors() {
  const { data } = await api.get('/Color/get-colors')
  const raw = data?.data ?? data
  return (Array.isArray(raw) ? raw : []) as Color[]
}

// Color endpoints take their data via query params (name only).
export async function addColor(payload: { name: string }) {
  const { data } = await api.post('/Color/add-color', null, {
    params: { ColorName: payload.name },
  })
  return data
}

export async function updateColor(payload: { id: number; name: string }) {
  const { data } = await api.put('/Color/update-color', null, {
    params: { Id: payload.id, ColorName: payload.name },
  })
  return data
}

export async function deleteColor(id: number) {
  const { data } = await api.delete('/Color/delete-color', { params: { id } })
  return data
}
