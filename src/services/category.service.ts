import { api } from './api'
import type { Category } from '@/types'

export async function getCategories() {
  const { data } = await api.get('/Category/get-categories')
  const raw = data?.data ?? data
  return (Array.isArray(raw) ? raw : []) as Category[]
}

// Category endpoints use multipart/form-data; CategoryImage (file) is required.
export async function addCategory(payload: { name: string; image: File }) {
  const form = new FormData()
  form.append('CategoryName', payload.name)
  form.append('CategoryImage', payload.image)
  const { data } = await api.post('/Category/add-category', form)
  return data
}

export async function updateCategory(payload: {
  id: number
  name: string
  image: File
}) {
  const form = new FormData()
  form.append('Id', String(payload.id))
  form.append('CategoryName', payload.name)
  form.append('CategoryImage', payload.image)
  const { data } = await api.put('/Category/update-category', form)
  return data
}

export async function deleteCategory(id: number) {
  const { data } = await api.delete('/Category/delete-category', {
    params: { id },
  })
  return data
}
