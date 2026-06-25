import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { TableToolbar } from '@/components/shared/TableToolbar'
import { Pagination } from '@/components/shared/Pagination'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingState } from '@/components/ui/Spinner'
import { ProductFormModal } from '@/components/products/ProductFormModal'
import { getProducts, deleteProduct } from '@/services/product.service'
import { formatPrice, imageUrl } from '@/lib/utils'
import type { Product } from '@/types'

const PAGE_SIZE = 8

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [editing, setEditing] = useState<Product | null>(null)
  const [formOpen, setFormOpen] = useState(false)
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

  return (
    <div data-aos="fade-up">
      <PageHeader
        title="Products"
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" /> Add product
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

      <div className="overflow-x-auto rounded-xl border border-line bg-white">
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
              <th className="px-2 py-3 font-medium">Product</th>
              <th className="px-2 py-3 font-medium">Inventory</th>
              <th className="px-2 py-3 font-medium">Category</th>
              <th className="px-2 py-3 font-medium">Price</th>
              <th className="px-2 py-3 font-medium">Action</th>
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
                    <span className="text-ink">{p.quantity} in stock</span>
                  ) : (
                    <Badge tone="neutral">Out of Stock</Badge>
                  )}
                </td>
                <td className="px-2 py-3 text-muted">
                  {p.categoryName ?? '—'}
                </td>
                <td className="px-2 py-3 text-ink">{formatPrice(p.price)}</td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditing(p)
                        setFormOpen(true)
                      }}
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
                  Маҳсулот ёфт нашуд.
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

      <ProductFormModal
        open={formOpen}
        product={editing}
        onClose={() => setFormOpen(false)}
        onSaved={load}
      />

      <ConfirmModal
        open={!!toDelete}
        title="Delete Items"
        message={`Are you sure you want to delete ${toDelete?.length ?? 0} selected item(s)?`}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
