// Shared domain types for the Fast Cart admin panel.

export interface ApiResponse<T> {
  data: T
  errorMessages?: string[] | null
  statusCode?: number
}

export interface Paged<T> {
  products?: T[]
  totalRecords?: number
  pageNumber?: number
  pageSize?: number
}

export interface LoginRequest {
  userName: string
  password: string
}

export interface Product {
  id: number
  productName: string
  description?: string
  price: number
  discountPrice?: number
  quantity?: number
  code?: string
  categoryId?: number
  categoryName?: string
  brandId?: number
  brandName?: string
  colorId?: number
  color?: string
  subCategoryId?: number
  hasDiscount?: boolean
  image?: string
}

export interface SubCategory {
  id: number
  subCategoryName: string
}

export interface Category {
  id: number
  categoryName: string
  categoryImage?: string
  subCategories?: SubCategory[]
}

export interface Brand {
  id: number
  brandName: string
  brandImage?: string
}

export interface Color {
  id: number
  colorName: string
}

export interface UserRole {
  id: string
  name: string
}

export interface UserProfile {
  userId: string
  userName?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  image?: string
  dob?: string
  userRoles?: UserRole[]
}
