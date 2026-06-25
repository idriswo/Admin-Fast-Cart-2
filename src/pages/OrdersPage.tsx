import { useState } from 'react'
import { Plus, Inbox } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { TableToolbar } from '@/components/shared/TableToolbar'
import { Button } from '@/components/ui/Button'

// The backend exposes no Orders endpoint yet, so this list stays empty.
// Wire it to a real endpoint here once one is available.
export function OrdersPage() {
  const [search, setSearch] = useState('')

  return (
    <div data-aos="fade-up">
      <PageHeader
        title="Orders"
        action={
          <Button>
            <Plus className="h-4 w-4" /> Add order
          </Button>
        }
      />

      <TableToolbar
        search={search}
        onSearch={setSearch}
        selectedCount={0}
        onBulkDelete={() => {}}
      />

      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-white py-20 text-center">
        <Inbox className="h-12 w-12 text-gray-300" />
        <p className="mt-3 font-medium text-ink">Ҳоло фармоиш нест</p>
        <p className="mt-1 text-sm text-muted">
          Фармоишҳо дар ин ҷо намоиш дода мешаванд.
        </p>
      </div>
    </div>
  )
}
