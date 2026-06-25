import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingState } from '@/components/ui/Spinner'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import {
  EntityFormModal,
  type EntityPayload,
} from '@/components/categories/EntityFormModal'
import { cn, imageUrl } from '@/lib/utils'
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/services/category.service'
import {
  getBrands,
  addBrand,
  updateBrand,
  deleteBrand,
} from '@/services/brand.service'

type Tab = 'Categories' | 'Brands' | 'Banners'
interface Entity {
  id: number
  name: string
  image?: string
}

const tabs: Tab[] = ['Categories', 'Brands', 'Banners']

export function CategoriesPage() {
  const [tab, setTab] = useState<Tab>('Categories')
  const [items, setItems] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Entity | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Entity | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    if (tab === 'Banners') {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const fetcher =
      tab === 'Categories'
        ? getCategories().then((rows) =>
            rows.map((c) => ({
              id: c.id,
              name: c.categoryName,
              image: c.categoryImage,
            }))
          )
        : getBrands().then((rows) =>
            rows.map((b) => ({
              id: b.id,
              name: b.brandName,
              image: b.brandImage,
            }))
          )
    fetcher
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [tab])

  const cfg =
    tab === 'Categories'
      ? {
          label: 'Category name',
          requiresImage: true,
          del: deleteCategory,
          submit: (p: EntityPayload) =>
            p.id
              ? updateCategory({ id: p.id, name: p.name, image: p.image! })
              : addCategory({ name: p.name, image: p.image! }),
        }
      : {
          label: 'Brand name',
          requiresImage: false,
          del: deleteBrand,
          submit: (p: EntityPayload) =>
            p.id
              ? updateBrand({ id: p.id, name: p.name })
              : addBrand({ name: p.name }),
        }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await cfg.del(toDelete.id)
      setToDelete(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div data-aos="fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                tab === t
                  ? 'bg-blue-50 text-brand'
                  : 'text-muted hover:bg-surface'
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {tab !== 'Banners' && (
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" /> Add new
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : tab === 'Banners' ? (
        <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center text-muted">
          Banners (API дастрас нест — UI placeholder)
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative rounded-xl border border-line bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => {
                    setEditing(it)
                    setFormOpen(true)
                  }}
                  className="text-brand"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setToDelete(it)} className="text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mb-3 flex h-16 items-center justify-center">
                {it.image ? (
                  <img
                    src={imageUrl(it.image)}
                    alt={it.name}
                    className="h-14 w-14 object-contain"
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-gray-300" />
                )}
              </div>
              <p className="text-center text-sm font-medium text-ink">
                {it.name}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <p className="col-span-full py-10 text-center text-muted">
              Чизе ёфт нашуд.
            </p>
          )}
        </div>
      )}

      <EntityFormModal
        open={formOpen}
        title={editing ? `Edit ${tab.slice(0, -1)}` : `Add new ${tab.slice(0, -1)}`}
        label={cfg.label}
        requiresImage={cfg.requiresImage}
        initial={editing}
        submit={cfg.submit}
        onClose={() => setFormOpen(false)}
        onSaved={load}
      />

      <ConfirmModal
        open={!!toDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${toDelete?.name}"?`}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
