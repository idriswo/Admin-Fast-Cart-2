import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { addProduct, updateProduct } from '@/services/product.service'
import { getBrands } from '@/services/brand.service'
import { getColors } from '@/services/color.service'
import { getSubCategories } from '@/services/subcategory.service'
import { toast } from '@/store/toast'
import type { Product, Brand, Color, SubCategory } from '@/types'

interface ProductFormValues {
  productName: string
  code: string
  price: number
  quantity: number
  description: string
  brandId: number
  colorId: number
  subCategoryId: number
  hasDiscount: boolean
  discountPrice: number
}

interface ProductFormModalProps {
  open: boolean
  product: Product | null
  onClose: () => void
  onSaved: () => void
}

const fieldLabel = 'mb-1 block text-sm font-medium'
const selectCls =
  'h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20'

export function ProductFormModal({
  open,
  product,
  onClose,
  onSaved,
}: ProductFormModalProps) {
  const isEdit = !!product
  const [images, setImages] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>()
  const hasDiscount = watch('hasDiscount')

  // Load the reference lists once, when the modal first opens.
  useEffect(() => {
    if (!open) return
    Promise.all([getBrands(), getColors(), getSubCategories()])
      .then(([b, c, s]) => {
        setBrands(b)
        setColors(c)
        setSubCategories(s)
      })
      .catch(() => {})
  }, [open])

  useEffect(() => {
    if (open) {
      reset({
        productName: product?.productName ?? '',
        code: product?.code ?? '',
        price: product?.price ?? 0,
        quantity: product?.quantity ?? 0,
        description: product?.description ?? '',
        brandId: product?.brandId ?? 0,
        colorId: product?.colorId ?? 0,
        subCategoryId: product?.subCategoryId ?? 0,
        hasDiscount: product?.hasDiscount ?? false,
        discountPrice: product?.discountPrice ?? 0,
      })
      setImages([])
    }
  }, [open, product, reset])

  const onSubmit = async (values: ProductFormValues) => {
    if (!isEdit && images.length === 0) {
      toast.error('Лутфан ҳадди ақал як расм интихоб кунед.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        id: product?.id,
        productName: values.productName,
        description: values.description,
        price: Number(values.price),
        quantity: Number(values.quantity),
        code: values.code,
        brandId: Number(values.brandId),
        colorId: Number(values.colorId),
        subCategoryId: Number(values.subCategoryId),
        hasDiscount: Boolean(values.hasDiscount),
        // Never send a negative discount; only meaningful when hasDiscount is on.
        discountPrice: values.hasDiscount
          ? Math.max(0, Number(values.discountPrice) || 0)
          : 0,
        images,
      }
      if (isEdit) await updateProduct(payload)
      else await addProduct(payload)

      toast.success(isEdit ? 'Маҳсулот навсозӣ шуд' : 'Маҳсулот илова шуд')
      onSaved()
      onClose()
    } catch {
      // interceptor toasts the error
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit product' : 'Add new product'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-ink">
        <div>
          <label className={fieldLabel}>Product name</label>
          <Input {...register('productName', { required: true })} />
          {errors.productName && (
            <p className="mt-1 text-xs text-danger">Ном лозим аст</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={fieldLabel}>Code</label>
            <Input {...register('code', { required: true })} />
          </div>
          <div>
            <label className={fieldLabel}>Price</label>
            <Input
              type="number"
              step="0.01"
              {...register('price', { required: true, valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={fieldLabel}>Count</label>
            <Input
              type="number"
              {...register('quantity', { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className={fieldLabel}>Brand</label>
            <select
              className={selectCls}
              {...register('brandId', { required: true, valueAsNumber: true })}
            >
              <option value={0} disabled>
                Интихоб кунед
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.brandName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={fieldLabel}>Color</label>
            <select
              className={selectCls}
              {...register('colorId', { required: true, valueAsNumber: true })}
            >
              <option value={0} disabled>
                Интихоб кунед
              </option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.colorName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={fieldLabel}>Sub category</label>
            <select
              className={selectCls}
              {...register('subCategoryId', {
                required: true,
                valueAsNumber: true,
              })}
            >
              <option value={0} disabled>
                Интихоб кунед
              </option>
              {subCategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subCategoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={fieldLabel}>Description</label>
          <textarea
            rows={3}
            placeholder="Тавсифи маҳсулот..."
            {...register('description', { required: true })}
            className="w-full resize-none rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-danger">Тавсиф лозим аст</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="hasDiscount"
            type="checkbox"
            {...register('hasDiscount')}
            className="h-4 w-4"
          />
          <label htmlFor="hasDiscount" className="text-sm">
            Тахфиф дорад (Discount)
          </label>
        </div>

        {hasDiscount && (
          <div>
            <label className={fieldLabel}>Discount price</label>
            <Input
              type="number"
              step="0.01"
              min={0}
              {...register('discountPrice', { valueAsNumber: true, min: 0 })}
            />
          </div>
        )}

        <div>
          <label className={fieldLabel}>
            Images {!isEdit && <span className="text-danger">*</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files ?? []))}
            className="text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface file:px-3 file:py-2 file:text-sm"
          />
          {isEdit && (
            <p className="mt-1 text-xs text-muted">
              Расм ҳангоми таҳрир тағйир намеёбад (API-и алоҳида лозим аст).
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Spinner className="text-white" /> : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
