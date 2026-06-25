import { api } from './api'
import type { Product } from '@/types'

interface ProductQuery {
  pageNumber?: number
  pageSize?: number
  productName?: string
  categoryId?: number
}

export async function getProducts(params: ProductQuery = {}) {
  const { data } = await api.get('/Product/get-products', { params })
  // Shape: { pageNumber, pageSize, totalPage, totalRecord, data: { products: [...] } }
  const products: Product[] = data?.data?.products ?? data?.products ?? []
  const totalRecords: number =
    data?.totalRecord ?? data?.totalRecords ?? products.length
  return { products, totalRecords }
}

export async function getProductById(id: number) {
  const { data } = await api.get('/Product/get-product-by-id', {
    params: { id },
  })
  return (data?.data ?? data) as Product
}

export interface ProductPayload {
  id?: number
  productName: string
  description: string
  price: number
  quantity: number
  code: string
  brandId: number
  colorId: number
  subCategoryId: number
  hasDiscount: boolean
  discountPrice?: number
  images: File[]
}

/** Create a product — multipart/form-data with PascalCase fields the API expects. */
export async function addProduct(p: ProductPayload) {
  const form = new FormData()
  form.append('ProductName', p.productName)
  form.append('Description', p.description)
  form.append('Price', String(p.price))
  form.append('Quantity', String(p.quantity))
  form.append('Code', p.code)
  form.append('BrandId', String(p.brandId))
  form.append('ColorId', String(p.colorId))
  form.append('SubCategoryId', String(p.subCategoryId))
  form.append('HasDiscount', String(p.hasDiscount))
  form.append('DiscountPrice', String(p.discountPrice ?? 0))
  p.images.forEach((file) => form.append('Images', file))

  const { data } = await api.post('/Product/add-product', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/** Update a product — the API binds these from the query string. */
export async function updateProduct(p: ProductPayload) {
  const { data } = await api.put('/Product/update-product', null, {
    params: {
      Id: p.id,
      ProductName: p.productName,
      Description: p.description,
      Price: p.price,
      Quantity: p.quantity,
      Code: p.code,
      BrandId: p.brandId,
      ColorId: p.colorId,
      SubCategoryId: p.subCategoryId,
      HasDiscount: p.hasDiscount,
      DiscountPrice: p.discountPrice ?? 0,
    },
  })
  return data
}

export async function deleteProduct(id: number) {
  const { data } = await api.delete('/Product/delete-product', {
    params: { id },
  })
  return data
}
