import { api } from './api'
import type { UserProfile } from '@/types'

interface CustomerQuery {
  pageNumber?: number
  pageSize?: number
  userName?: string
}

export async function getCustomers(params: CustomerQuery = {}) {
  const { data } = await api.get('/UserProfile/get-user-profiles', {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      UserName: params.userName || undefined,
    },
  })
  // Shape: { pageNumber, pageSize, totalPage, totalRecord, data: [...] }
  const customers: UserProfile[] = data?.data ?? data ?? []
  const totalRecords: number = data?.totalRecord ?? customers.length
  return { customers, totalRecords }
}

export async function getCustomerById(id: string) {
  const { data } = await api.get('/UserProfile/get-user-profile-by-id', {
    params: { id },
  })
  return (data?.data ?? data) as UserProfile
}

export async function deleteCustomer(id: string) {
  const { data } = await api.delete('/UserProfile/delete-user', {
    params: { id },
  })
  return data
}
