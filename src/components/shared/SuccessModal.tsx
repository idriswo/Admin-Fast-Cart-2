import { Check } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface SuccessModalProps {
  open: boolean
  title: string
  message: string
  primaryLabel: string
  secondaryLabel: string
  onPrimary: () => void
  onSecondary: () => void
  onClose: () => void
}

/** Success confirmation dialog (matches the "03 Message" mockup). */
export function SuccessModal({
  open,
  title,
  message,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
}: SuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="">
      <div className="-mt-8 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <Check className="h-7 w-7 text-brand" strokeWidth={2.5} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
          <Button onClick={onPrimary}>{primaryLabel}</Button>
        </div>
      </div>
    </Modal>
  )
}
