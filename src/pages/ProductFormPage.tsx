import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, UploadCloud, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner, LoadingState } from '@/components/ui/Spinner'
import { SuccessModal } from '@/components/shared/SuccessModal'
import { TagInput } from '@/components/products/TagInput'
import {
  addProduct,
  updateProduct,
  getProductById,
} from '@/services/product.service'
import { getBrands } from '@/services/brand.service'
import { getColors } from '@/services/color.service'
import { getSubCategories } from '@/services/subcategory.service'
import { toast } from '@/store/toast'
import type { Brand, Color, SubCategory } from '@/types'

interface FormValues {
  productName: string
  code: string
  description: string
  price: number
  quantity: number
  brandId: number
  subCategoryId: number
  hasDiscount: boolean
  discountPrice: number
}

// Map known colour names to a swatch hex (API only returns the name).
const colourHex: Record<string, string> = {
  Black: '#111827',
  Silver: '#cbd5e1',
  Blue: '#2563eb',
  Red: '#ef4444',
  Green: '#22c55e',
  White: '#f3f4f6',
  q: '#a3a3a3',
}

const fieldLabel = 'mb-1 block text-sm font-medium text-ink'
const selectCls =
  'h-11 w-full rounded-lg border border-line bg-card px-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20'

export function ProductFormPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [colorId, setColorId] = useState(0)
  const [images, setImages] = useState<File[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [weights, setWeights] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { hasDiscount: false } })
  const hasDiscount = watch('hasDiscount')

  useEffect(() => {
    Promise.all([getBrands(), getColors(), getSubCategories()]).then(
      ([b, c, s]) => {
        setBrands(b)
        setColors(c)
        setSubCategories(s)
      }
    )
  }, [])

  useEffect(() => {
    if (!isEdit) return
    getProductById(Number(id))
      .then((p) => {
        reset({
          productName: p.productName ?? '',
          code: p.code ?? '',
          description: p.description ?? '',
          price: p.price ?? 0,
          quantity: p.quantity ?? 0,
          brandId: p.brandId ?? 0,
          subCategoryId: p.subCategoryId ?? 0,
          hasDiscount: p.hasDiscount ?? false,
          discountPrice: p.discountPrice ?? 0,
        })
        setColorId(p.colorId ?? 0)
        setSizes(p.size ? p.size.split(',').map((s) => s.trim()).filter(Boolean) : [])
        setWeights(p.weight ? p.weight.split(',').map((s) => s.trim()).filter(Boolean) : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, isEdit, reset])

  const onSubmit = async (values: FormValues) => {
    if (!colorId) return toast.error(t('common.selectPlaceholder') + ': ' + t('form.colour'))
    if (!isEdit && images.length === 0) return toast.error(t('form.imageRequired'))

    setSaving(true)
    try {
      const payload = {
        id: id ? Number(id) : undefined,
        productName: values.productName,
        description: values.description,
        price: Number(values.price),
        quantity: Number(values.quantity),
        code: values.code,
        brandId: Number(values.brandId),
        colorId,
        subCategoryId: Number(values.subCategoryId),
        hasDiscount: Boolean(values.hasDiscount),
        discountPrice: values.hasDiscount
          ? Math.max(0, Number(values.discountPrice) || 0)
          : 0,
        size: sizes.join(','),
        weight: weights.join(','),
        images,
      }
      if (isEdit) {
        await updateProduct(payload)
        toast.success(t('form.editProductTitle'))
        navigate('/products')
      } else {
        await addProduct(payload)
        // Show the "Successfully add" message modal (mockup 03 Message).
        setShowSuccess(true)
      }
    } catch {
      // interceptor toasts the error
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState />

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-aos="fade-up">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="flex items-center gap-3 text-xl font-bold text-ink"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('nav.products')} /{' '}
          <span className="text-muted">
            {isEdit ? t('common.edit') : t('common.addNew')}
          </span>
        </button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products')}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Spinner className="text-white" /> : t('common.save')}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="mb-4 font-semibold text-ink">
              {t('form.information')}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className={fieldLabel}>{t('form.productName')}</label>
                <Input {...register('productName', { required: true })} />
                {errors.productName && (
                  <p className="mt-1 text-xs text-danger">
                    {t('form.productName')}
                  </p>
                )}
              </div>
              <div>
                <label className={fieldLabel}>{t('form.code')}</label>
                <Input {...register('code', { required: true })} />
              </div>
            </div>

            <div className="mt-4">
              <label className={fieldLabel}>{t('form.description')}</label>
              <textarea
                rows={4}
                placeholder={t('form.descriptionPlaceholder')}
                {...register('description', { required: true })}
                className="w-full resize-none rounded-lg border border-line bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>{t('form.subCategory')}</label>
                <select
                  className={selectCls}
                  {...register('subCategoryId', {
                    required: true,
                    valueAsNumber: true,
                  })}
                >
                  <option value={0} disabled>
                    {t('common.selectPlaceholder')}
                  </option>
                  {subCategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.subCategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={fieldLabel}>{t('form.brand')}</label>
                <select
                  className={selectCls}
                  {...register('brandId', {
                    required: true,
                    valueAsNumber: true,
                  })}
                >
                  <option value={0} disabled>
                    {t('common.selectPlaceholder')}
                  </option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.brandName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold text-ink">{t('form.price')}</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={fieldLabel}>{t('form.price')}</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('price', { required: true, valueAsNumber: true })}
                />
              </div>
              <div>
                <label className={fieldLabel}>{t('form.discountPrice')}</label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  disabled={!hasDiscount}
                  {...register('discountPrice', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className={fieldLabel}>{t('form.count')}</label>
                <Input
                  type="number"
                  {...register('quantity', { valueAsNumber: true })}
                />
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" {...register('hasDiscount')} className="h-4 w-4" />
              {t('form.hasDiscount')}
            </label>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold text-ink">{t('form.options')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={fieldLabel}>{t('form.size')}</label>
                <TagInput
                  values={sizes}
                  onChange={setSizes}
                  placeholder={t('form.addValue')}
                />
              </div>
              <div>
                <label className={fieldLabel}>{t('form.weight')}</label>
                <TagInput
                  values={weights}
                  onChange={setWeights}
                  placeholder={t('form.addValue')}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-semibold text-ink">{t('form.colour')}</h2>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.colorName}
                  onClick={() => setColorId(c.id)}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    colorId === c.id
                      ? 'border-brand ring-2 ring-brand/30'
                      : 'border-line'
                  }`}
                  style={{ backgroundColor: colourHex[c.colorName] ?? '#94a3b8' }}
                />
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold text-ink">{t('form.images')}</h2>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-line py-8 text-center">
              <UploadCloud className="mb-2 h-6 w-6 text-muted" />
              <span className="text-sm font-medium text-brand">
                {t('form.uploadHint')}
              </span>
              <span className="mt-1 text-xs text-muted">
                {t('form.uploadFormats')}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) =>
                  setImages((prev) => [
                    ...prev,
                    ...Array.from(e.target.files ?? []),
                  ])
                }
              />
            </label>

            {images.length > 0 && (
              <ul className="mt-4 space-y-2">
                {images.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-line p-2"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-9 w-9 rounded object-cover"
                    />
                    <span className="flex-1 truncate text-sm text-ink">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {isEdit && (
              <p className="mt-2 text-xs text-muted">{t('form.imageHintEdit')}</p>
            )}
          </Card>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        title={t('form.successAdd')}
        message={t('form.successAddMsg')}
        primaryLabel={t('common.addNew')}
        secondaryLabel={t('form.goToProducts')}
        onPrimary={() => {
          // Reset for a fresh product entry.
          reset({
            productName: '',
            code: '',
            description: '',
            price: 0,
            quantity: 0,
            brandId: 0,
            subCategoryId: 0,
            hasDiscount: false,
            discountPrice: 0,
          })
          setColorId(0)
          setImages([])
          setSizes([])
          setWeights([])
          setShowSuccess(false)
        }}
        onSecondary={() => navigate('/products')}
        onClose={() => navigate('/products')}
      />
    </form>
  )
}
