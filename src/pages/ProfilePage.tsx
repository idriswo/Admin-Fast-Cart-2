import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { User } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner, LoadingState } from '@/components/ui/Spinner'
import { getMyProfile, updateMyProfile } from '@/services/profile.service'
import { imageUrl } from '@/lib/utils'
import { toast } from '@/store/toast'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dob: string
}

const fieldLabel = 'mb-1 block text-sm font-medium text-ink'

export function ProfilePage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string | undefined>()
  const { register, handleSubmit, reset } = useForm<FormValues>()

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        if (!p) return
        reset({
          firstName: p.firstName ?? '',
          lastName: p.lastName ?? '',
          email: p.email ?? '',
          phoneNumber: p.phoneNumber ?? '',
          dob: p.dob ? p.dob.split('T')[0] : '',
        })
        setCurrentImage(p.image)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (values: FormValues) => {
    setSaving(true)
    try {
      await updateMyProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        dob: values.dob,
        image: image ?? undefined,
      })
      toast.success(t('profile.updated'))
    } catch {
      // interceptor toasts the error
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState />

  const preview = image ? URL.createObjectURL(image) : imageUrl(currentImage)

  return (
    <div data-aos="fade-up">
      <PageHeader title={t('profile.title')} />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-surface">
              {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-muted" />
              )}
            </div>
            <label className="cursor-pointer text-sm font-medium text-brand">
              {t('profile.photo')}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={fieldLabel}>{t('profile.firstName')}</label>
              <Input {...register('firstName')} />
            </div>
            <div>
              <label className={fieldLabel}>{t('profile.lastName')}</label>
              <Input {...register('lastName')} />
            </div>
            <div>
              <label className={fieldLabel}>{t('profile.email')}</label>
              <Input type="email" {...register('email')} />
            </div>
            <div>
              <label className={fieldLabel}>{t('profile.phone')}</label>
              <Input {...register('phoneNumber')} />
            </div>
            <div>
              <label className={fieldLabel}>{t('profile.dob')}</label>
              <Input type="date" {...register('dob')} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner className="text-white" /> : t('common.save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
