import { useEffect, useState } from 'react'
import { Package, Users, FolderTree, Tag, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingState } from '@/components/ui/Spinner'
import { CategoryBarChart } from '@/components/dashboard/CategoryBarChart'
import { getProducts } from '@/services/product.service'
import { getCustomers } from '@/services/customer.service'
import { getCategories } from '@/services/category.service'
import { getBrands } from '@/services/brand.service'
import { formatPrice, imageUrl } from '@/lib/utils'
import type { Product, UserProfile } from '@/types'

interface Stats {
  products: number
  customers: number
  categories: number
  brands: number
  inventoryValue: number
  byCategory: { label: string; value: number }[]
  topProducts: Product[]
  recentCustomers: UserProfile[]
}

export function DashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    Promise.all([
      getProducts({ pageSize: 200 }),
      getCustomers({ pageNumber: 1, pageSize: 5 }),
      getCategories(),
      getBrands(),
    ])
      .then(([prodRes, custRes, categories, brands]) => {
        const products = prodRes.products

        // Group products by category name (real aggregation).
        const counts = new Map<string, number>()
        for (const p of products) {
          const key = p.categoryName ?? 'Дигар'
          counts.set(key, (counts.get(key) ?? 0) + 1)
        }
        const byCategory = [...counts.entries()]
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6)

        const inventoryValue = products.reduce(
          (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 0),
          0
        )

        const topProducts = [...products]
          .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
          .slice(0, 5)

        setStats({
          products: prodRes.totalRecords,
          customers: custRes.totalRecords,
          categories: categories.length,
          brands: brands.length,
          inventoryValue,
          byCategory,
          topProducts,
          recentCustomers: custRes.customers,
        })
      })
      .catch(() => setStats(null))
  }, [])

  if (!stats) return <LoadingState />

  const cards = [
    { label: t('dashboard.products'), value: stats.products, icon: Package, tint: 'bg-blue-100 text-brand' },
    { label: t('dashboard.customers'), value: stats.customers, icon: Users, tint: 'bg-emerald-100 text-emerald-500' },
    { label: t('dashboard.categories'), value: stats.categories, icon: FolderTree, tint: 'bg-amber-100 text-amber-500' },
    { label: t('dashboard.brands'), value: stats.brands, icon: Tag, tint: 'bg-rose-100 text-rose-500' },
  ]

  return (
    <div className="space-y-6" data-aos="fade-up">
      <h1 className="text-2xl font-bold text-ink">{t('dashboard.title')}</h1>

      {/* Real stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${c.tint}`}>
              <c.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted">{c.label}</p>
              <p className="text-2xl font-bold text-ink">{c.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: analytics */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-ink">
                {t('dashboard.productsByCategory')}
              </h2>
              <span className="text-sm text-muted">
                {t('dashboard.inventory')}: {formatPrice(stats.inventoryValue)}
              </span>
            </div>
            <CategoryBarChart data={stats.byCategory} />
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold text-ink">
              {t('dashboard.recentCustomers')}
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th className="pb-3 font-medium">{t('dashboard.name')}</th>
                  <th className="pb-3 font-medium">{t('dashboard.email')}</th>
                  <th className="pb-3 font-medium">{t('dashboard.role')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCustomers.map((c) => (
                  <tr key={c.userId} className="border-t border-line">
                    <td className="flex items-center gap-2 py-3 font-medium text-ink">
                      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-surface">
                        {c.image ? (
                          <img src={imageUrl(c.image)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-muted" />
                        )}
                      </span>
                      {[c.firstName, c.lastName].filter(Boolean).join(' ') ||
                        c.userName ||
                        'Unnamed'}
                    </td>
                    <td className="py-3 text-muted">{c.email || '—'}</td>
                    <td className="py-3">
                      {c.userRoles?.[0]?.name && (
                        <Badge
                          tone={
                            c.userRoles[0].name.includes('Admin')
                              ? 'info'
                              : 'neutral'
                          }
                        >
                          {c.userRoles[0].name}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right: top priced products (real) */}
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">
              {t('dashboard.topProducts')}
            </h2>
          </div>
          <div className="space-y-4">
            {stats.topProducts.length === 0 && (
              <p className="text-sm text-muted">Маҳсулот нест.</p>
            )}
            {stats.topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface">
                  {p.image && (
                    <img
                      src={imageUrl(p.image)}
                      alt={p.productName}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {p.productName}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {p.categoryName ?? '—'}
                  </p>
                </div>
                <span className="text-sm font-medium text-ink">
                  {formatPrice(p.price)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
