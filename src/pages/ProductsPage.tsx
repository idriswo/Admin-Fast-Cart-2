import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { TableToolbar } from '@/components/shared/TableToolbar'
import { Pagination } from '@/components/shared/Pagination'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingState } from '@/components/ui/Spinner'
import { getProducts, deleteProduct } from '@/services/product.service'
import { formatPrice, imageUrl } from '@/lib/utils'
import type { Product } from '@/types'

const PAGE_SIZE = 8

export function ProductsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [toDelete, setToDelete] = useState<Product[] | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    getProducts({ pageSize: 100 })
      .then((res) => setProducts(res.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(
    () =>
      products.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  )

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggle = (id: number) =>
    setSelected((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () =>
    setSelected((s) =>
      s.size === pageItems.length
        ? new Set()
        : new Set(pageItems.map((p) => p.id))
    )

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await Promise.all(toDelete.map((p) => deleteProduct(p.id)))
      setSelected(new Set())
      setToDelete(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <LoadingState />

  // Rich empty state (mockup Products-1) when there are no products at all.
  if (products.length === 0) {
    return (
      <div data-aos="fade-up">
        <PageHeader title={t('products.title')} />
        <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-card py-24 text-center">
          <ShoppingBag className="h-14 w-14 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-ink">
            {t('products.emptyTitle')}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {t('products.emptyHint')}
          </p>
          <Button
            className="mt-5"
            onClick={() => navigate('/products/new')}
          >
            <Plus className="h-4 w-4" /> {t('common.addProduct')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div data-aos="fade-up">
      <PageHeader
        title={t('products.title')}
        action={
          <Button onClick={() => navigate('/products/new')}>
            <Plus className="h-4 w-4" /> {t('common.addProduct')}
          </Button>
        }
      />

      <TableToolbar
        search={search}
        onSearch={(v) => {
          setSearch(v)
          setPage(1)
        }}
        selectedCount={selected.size}
        onBulkDelete={() =>
          setToDelete(products.filter((p) => selected.has(p.id)))
        }
      />

      <div className="overflow-x-auto rounded-xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    pageItems.length > 0 && selected.size === pageItems.length
                  }
                  onChange={toggleAll}
                />
              </th>
              <th className="px-2 py-3 font-medium">{t('products.product')}</th>
              <th className="px-2 py-3 font-medium">{t('products.inventory')}</th>
              <th className="px-2 py-3 font-medium">{t('products.category')}</th>
              <th className="px-2 py-3 font-medium">{t('products.price')}</th>
              <th className="px-2 py-3 font-medium">{t('products.action')}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => (
              <tr
                key={p.id}
                className="border-b border-line last:border-0 hover:bg-surface"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                  />
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-surface">
                      {p.image && (
                        <img
                          src={imageUrl(p.image)}
                          alt={p.productName}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium text-ink">{p.productName}</span>
                  </div>
                </td>
                <td className="px-2 py-3">
                  {p.quantity && p.quantity > 0 ? (
                    <span className="text-ink">
                      {p.quantity} {t('products.inStock')}
                    </span>
                  ) : (
                    <Badge tone="neutral">{t('products.outOfStock')}</Badge>
                  )}
                </td>
                <td className="px-2 py-3 text-muted">
                  {p.categoryName ?? '—'}
                </td>
                <td className="px-2 py-3 text-ink">{formatPrice(p.price)}</td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/products/${p.id}/edit`)}
                      className="text-brand"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setToDelete([p])}
                      className="text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  {t('common.notFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        total={filtered.length}
        onChange={setPage}
      />

      <ConfirmModal
        open={!!toDelete}
        title={t('confirm.deleteItems')}
        message={t('confirm.deleteItemsMsg', { count: toDelete?.length ?? 0 })}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
