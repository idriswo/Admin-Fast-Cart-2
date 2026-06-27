import { useState } from 'react'
import { Plus, Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/PageHeader'
import { TableToolbar } from '@/components/shared/TableToolbar'
import { Button } from '@/components/ui/Button'

// The backend exposes no Orders endpoint yet, so this list stays empty.
// Wire it to a real endpoint here once one is available.
export function OrdersPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  return (
    <div data-aos="fade-up">
      <PageHeader
        title={t('orders.title')}
        action={
          <Button>
            <Plus className="h-4 w-4" /> {t('common.addOrder')}
          </Button>
        }
      />

      <TableToolbar
        search={search}
        onSearch={setSearch}
        selectedCount={0}
        onBulkDelete={() => {}}
      />

      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-card py-20 text-center">
        <Inbox className="h-12 w-12 text-gray-300" />
        <p className="mt-3 font-medium text-ink">{t('orders.empty')}</p>
        <p className="mt-1 text-sm text-muted">{t('orders.emptyHint')}</p>
      </div>
    </div>
  )
}
