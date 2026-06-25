import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  loading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

/** Destructive confirmation dialog (matches the "Delete Items" mockup). */
export function ConfirmModal({
  open,
  title,
  message,
  loading,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="primary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger-outline" onClick={onConfirm} disabled={loading}>
            Delete
          </Button>
        </>
      }
    >
      {message}
    </Modal>
  )
}
