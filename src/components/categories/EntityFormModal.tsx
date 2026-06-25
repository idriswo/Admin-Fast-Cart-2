import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { toast } from '@/store/toast'

export interface EntityPayload {
  id?: number
  name: string
  image?: File
}

interface EntityFormModalProps {
  open: boolean
  title: string
  label: string
  /** Existing record id+name when editing, null when creating. */
  initial: { id: number; name: string } | null
  /** Whether an image file is required (categories yes, brands no). */
  requiresImage: boolean
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
  submit,
  onClose,
  onSaved,
}: EntityFormModalProps) {
  const isEdit = !!initial
  const [image, setImage] = useState<File | null>(null)
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
    }
  }, [open, initial, reset])

  const onSubmit = async ({ name }: { name: string }) => {
    if (requiresImage && !image) {
      toast.error('Лутфан расм интихоб кунед (ҳатмӣ).')
      return
    }
    setSaving(true)
    try {
      await submit({ id: initial?.id, name, image: image ?? undefined })
      toast.success(isEdit ? 'Навсозӣ шуд' : 'Илова шуд')
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
            <p className="mt-1 text-xs text-danger">Ном лозим аст</p>
          )}
        </div>
        {requiresImage && (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Image <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface file:px-3 file:py-2 file:text-sm"
            />
          </div>
        )}
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
