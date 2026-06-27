import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
import {
  getSubCategories,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '@/services/subcategory.service'
import {
  getColors,
  addColor,
  updateColor,
  deleteColor,
} from '@/services/color.service'

type Tab = 'Categories' | 'SubCategories' | 'Brands' | 'Colors' | 'Banners'
interface Entity {
  id: number
  name: string
  image?: string
}

const tabs: Tab[] = ['Categories', 'SubCategories', 'Brands', 'Colors', 'Banners']

const tabLabelKey: Record<Tab, string> = {
  Categories: 'categories.categories',
  SubCategories: 'categories.subCategories',
  Brands: 'categories.brands',
  Colors: 'categories.colors',
  Banners: 'categories.banners',
}

export function CategoriesPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('Categories')
  const [items, setItems] = useState<Entity[]>([])
  const [categoryOptions, setCategoryOptions] = useState<
    { id: number; name: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Entity | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Entity | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Parent categories are needed for the sub-category form dropdown.
  useEffect(() => {
    getCategories()
      .then((rows) =>
        setCategoryOptions(rows.map((c) => ({ id: c.id, name: c.categoryName })))
      )
      .catch(() => setCategoryOptions([]))
  }, [])

  const load = () => {
    if (tab === 'Banners') {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    let fetcher: Promise<Entity[]>
    if (tab === 'Categories') {
      fetcher = getCategories().then((rows) =>
        rows.map((c) => ({
          id: c.id,
          name: c.categoryName,
          image: c.categoryImage,
        }))
      )
    } else if (tab === 'SubCategories') {
      fetcher = getSubCategories().then((rows) =>
        rows.map((s) => ({ id: s.id, name: s.subCategoryName }))
      )
    } else if (tab === 'Colors') {
      fetcher = getColors().then((rows) =>
        rows.map((c) => ({ id: c.id, name: c.colorName }))
      )
    } else {
      fetcher = getBrands().then((rows) =>
        rows.map((b) => ({ id: b.id, name: b.brandName, image: b.brandImage }))
      )
    }
    fetcher
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [tab])

  let cfg: {
    label: string
    requiresImage: boolean
    categories?: { id: number; name: string }[]
    del: (id: number) => Promise<unknown>
    submit: (p: EntityPayload) => Promise<unknown>
  }
  if (tab === 'Categories') {
    cfg = {
      label: t('form.categoryName'),
      requiresImage: true,
      del: deleteCategory,
      submit: (p) =>
        p.id
          ? updateCategory({ id: p.id, name: p.name, image: p.image! })
          : addCategory({ name: p.name, image: p.image! }),
    }
  } else if (tab === 'SubCategories') {
    cfg = {
      label: t('form.subCategory'),
      requiresImage: false,
      categories: categoryOptions,
      del: deleteSubCategory,
      submit: (p) =>
        p.id
          ? updateSubCategory({
              id: p.id,
              name: p.name,
              categoryId: p.categoryId!,
            })
          : addSubCategory({ name: p.name, categoryId: p.categoryId! }),
    }
  } else if (tab === 'Colors') {
    cfg = {
      label: t('form.colour'),
      requiresImage: false,
      del: deleteColor,
      submit: (p) =>
        p.id ? updateColor({ id: p.id, name: p.name }) : addColor({ name: p.name }),
    }
  } else {
    cfg = {
      label: t('form.brandName'),
      requiresImage: false,
      del: deleteBrand,
      submit: (p) =>
        p.id ? updateBrand({ id: p.id, name: p.name }) : addBrand({ name: p.name }),
    }
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
          {tabs.map((tab_) => (
            <button
              key={tab_}
              onClick={() => setTab(tab_)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                tab === tab_
                  ? 'bg-blue-50 text-brand'
                  : 'text-muted hover:bg-surface'
              )}
            >
              {t(tabLabelKey[tab_])}
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
            <Plus className="h-4 w-4" /> {t('common.addNew')}
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : tab === 'Banners' ? (
        <div className="rounded-xl border border-dashed border-line bg-card py-16 text-center text-muted">
          {t('categories.bannersPlaceholder')}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative rounded-xl border border-line bg-card p-4 transition-shadow hover:shadow-md"
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
              {t('common.notFound')}
            </p>
          )}
        </div>
      )}

      <EntityFormModal
        open={formOpen}
        title={editing ? `${t('common.edit')} — ${cfg.label}` : `${t('common.addNew')} — ${cfg.label}`}
        label={cfg.label}
        requiresImage={cfg.requiresImage}
        categories={cfg.categories}
        initial={editing}
        submit={cfg.submit}
        onClose={() => setFormOpen(false)}
        onSaved={load}
      />

      <ConfirmModal
        open={!!toDelete}
        title={t('confirm.deleteItem')}
        message={t('confirm.deleteItemMsg', { name: toDelete?.name ?? '' })}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
