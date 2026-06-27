import { api } from './api'
import type { SubCategory } from '@/types'

export async function getSubCategories() {
  const { data } = await api.get('/SubCategory/get-sub-category')
  return (data?.data ?? data ?? []) as SubCategory[]
}

// SubCategory endpoints take their data via query params (name + parent category).
export async function addSubCategory(payload: {
  name: string
  categoryId: number
}) {
  const { data } = await api.post('/SubCategory/add-sub-category', null, {
    params: { SubCategoryName: payload.name, CategoryId: payload.categoryId },
  })
  return data
}

export async function updateSubCategory(payload: {
  id: number
  name: string
  categoryId: number
}) {
  const { data } = await api.put('/SubCategory/update-sub-category', null, {
    params: {
      Id: payload.id,
      SubCategoryName: payload.name,
      CategoryId: payload.categoryId,
    },
  })
  return data
}

export async function deleteSubCategory(id: number) {
  const { data } = await api.delete('/SubCategory/delete-sub-category', {
    params: { id },
  })
  return data
}
