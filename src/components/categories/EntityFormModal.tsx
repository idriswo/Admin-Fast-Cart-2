import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { UploadCloud } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { toast } from '@/store/toast'

export interface EntityPayload {
  id?: number
  name: string
  image?: File
  categoryId?: number
}

interface EntityFormModalProps {
  open: boolean
  title: string
  label: string
  /** Existing record id+name when editing, null when creating. */
  initial: { id: number; name: string } | null
  /** Whether an image file is required (categories yes, brands no). */
  requiresImage: boolean
  /** When set, render a parent-category dropdown (sub-categories). */
  categories?: { id: number; name: string }[]
  submit: (payload: EntityPayload) => Promise<unknown>
  onClose: () => void
  onSaved: () => void
}

export function EntityFormModal({
  open,
  title,
  label,
  initial,
  requiresImage,
  categories,
  submit,
  onClose,
  onSaved,
}: EntityFormModalProps) {
  const { t } = useTranslation()
  const isEdit = !!initial
  const [image, setImage] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState(0)
  const [saving, setSaving] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>()

  useEffect(() => {
    if (open) {
      reset({ name: initial?.name ?? '' })
      setImage(null)
      setCategoryId(0)
    }
  }, [open, initial, reset])

  const onSubmit = async ({ name }: { name: string }) => {
    if (requiresImage && !image) {
      toast.error(t('form.imageRequired'))
      return
    }
    if (categories && !categoryId) {
      toast.error(t('common.selectPlaceholder') + ': ' + t('categories.categories'))
      return
    }
    setSaving(true)
    try {
      await submit({
        id: initial?.id,
        name,
        image: image ?? undefined,
        categoryId: categories ? categoryId : undefined,
      })
      toast.success(isEdit ? t('common.save') : t('common.addNew'))
      onSaved()
      onClose()
    } catch {
      // interceptor toasts the error
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-ink">
        <div>
          <label className="mb-1 block text-sm font-medium">{label}</label>
          <Input {...register('name', { required: true })} />
          {errors.name && (
            <p className="mt-1 text-xs text-danger">{label}</p>
          )}
        </div>
        {categories && (
          <div>
            <label className="mb-1 block text-sm font-medium">
              {t('categories.categories')}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="h-11 w-full rounded-lg border border-line bg-card px-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value={0} disabled>
                {t('common.selectPlaceholder')}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {requiresImage && (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-line py-6 text-center">
            <UploadCloud className="mb-2 h-6 w-6 text-muted" />
            <span className="text-sm font-medium text-brand">
              {image ? image.name : t('form.uploadHint')}
            </span>
            <span className="mt-1 text-xs text-muted">
              {t('form.uploadFormats')}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Spinner className="text-white" /> : t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
