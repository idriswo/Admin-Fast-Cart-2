import { api } from './api'
import { decodeJwt } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import type { UserProfile } from '@/types'

/** Read the current user's id from the JWT `sid` claim. */
export function currentUserId(): string | null {
  const token = useAuthStore.getState().token
  if (!token) return null
  const claims = decodeJwt(token)
  return (claims?.sid as string) ?? (claims?.sub as string) ?? null
}

export async function getMyProfile() {
  const id = currentUserId()
  if (!id) return null
  const { data } = await api.get('/UserProfile/get-user-profile-by-id', {
    params: { id },
  })
  return (data?.data ?? data) as UserProfile
}

export interface ProfilePayload {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dob: string
  image?: File
}

export async function updateMyProfile(p: ProfilePayload) {
  const form = new FormData()
  form.append('FirstName', p.firstName)
  form.append('LastName', p.lastName)
  form.append('Email', p.email)
  form.append('PhoneNumber', p.phoneNumber)
  form.append('Dob', p.dob)
  if (p.image) form.append('Image', p.image)
  const { data } = await api.put('/UserProfile/update-user-profile', form)
  return data
}
