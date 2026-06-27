import { api } from './api'
import type { UserProfile, UserRole } from '@/types'

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
  const raw = data?.data ?? data
  const customers: UserProfile[] = Array.isArray(raw) ? raw : []
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

export async function getUserRoles() {
  const { data } = await api.get('/UserProfile/get-user-roles')
  const raw = data?.data ?? data
  return (Array.isArray(raw) ? raw : []) as UserRole[]
}

export async function addRoleToUser(userId: string, roleId: string) {
  const { data } = await api.post('/UserProfile/addrole-from-user', null, {
    params: { UserId: userId, RoleId: roleId },
  })
  return data
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  const { data } = await api.delete('/UserProfile/remove-role-from-user', {
    params: { UserId: userId, RoleId: roleId },
  })
  return data
}

/** Replace a user's roles with a single new role (remove old, add new). */
export async function changeUserRole(
  userId: string,
  newRoleId: string,
  currentRoleIds: string[]
) {
  for (const rid of currentRoleIds) {
    if (rid !== newRoleId) {
      await removeRoleFromUser(userId, rid).catch(() => {})
    }
  }
  if (!currentRoleIds.includes(newRoleId)) {
    await addRoleToUser(userId, newRoleId)
  }
}
