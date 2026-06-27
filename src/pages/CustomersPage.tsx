import { useEffect, useState } from 'react'
import { Trash2, User, Search, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingState, Spinner } from '@/components/ui/Spinner'
import { imageUrl } from '@/lib/utils'
import {
  getCustomers,
  deleteCustomer,
  getUserRoles,
  addRoleToUser,
  removeRoleFromUser,
} from '@/services/customer.service'
import type { UserProfile, UserRole } from '@/types'

export function CustomersPage() {
  const { t } = useTranslation()
  const [customers, setCustomers] = useState<UserProfile[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [toDelete, setToDelete] = useState<UserProfile | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Role management
  const [roles, setRoles] = useState<UserRole[]>([])
  const [roleUser, setRoleUser] = useState<UserProfile | null>(null)
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set())
  const [savingRole, setSavingRole] = useState(false)

  useEffect(() => {
    getUserRoles()
      .then(setRoles)
      .catch(() => setRoles([]))
  }, [])

  const openRoleModal = (c: UserProfile) => {
    setRoleUser(c)
    setSelectedRoleIds(new Set((c.userRoles ?? []).map((r) => r.id)))
  }

  const toggleRole = (id: string) =>
    setSelectedRoleIds((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const saveRole = async () => {
    if (!roleUser) return
    setSavingRole(true)
    try {
      const current = new Set((roleUser.userRoles ?? []).map((r) => r.id))
      // Add newly checked roles, remove unchecked ones.
      for (const id of selectedRoleIds) {
        if (!current.has(id)) await addRoleToUser(roleUser.userId, id).catch(() => {})
      }
      for (const id of current) {
        if (!selectedRoleIds.has(id))
          await removeRoleFromUser(roleUser.userId, id).catch(() => {})
      }
      setRoleUser(null)
      load()
    } finally {
      setSavingRole(false)
    }
  }

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  const load = () => {
    setLoading(true)
    getCustomers({ pageNumber: page, pageSize, userName: debounced })
      .then((res) => {
        setCustomers(res.customers)
        setTotal(res.totalRecords)
        // Grow the role pool with any roles seen on these users (e.g. SuperAdmin),
        // so every user's select offers the full set of roles.
        setRoles((prev) => {
          const merged = [...prev]
          for (const c of res.customers) {
            for (const r of c.userRoles ?? []) {
              if (r.id && !merged.some((m) => m.id === r.id)) merged.push(r)
            }
          }
          return merged
        })
      })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [page, pageSize, debounced])

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await deleteCustomer(toDelete.userId)
      setToDelete(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  const pageCount = Math.ceil(total / pageSize)

  return (
    <div data-aos="fade-up">
      <PageHeader title={t('customers.title')} />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('customers.searchUsername')}
            className="h-11 w-72 rounded-lg border border-line bg-card pl-3.5 pr-9 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-muted">{t('common.show')}</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
            className="h-11 rounded-lg border border-line bg-card px-3 text-sm focus:border-brand focus:outline-none"
          >
            <option value={10}>10 / {t('common.perPage')}</option>
            <option value={20}>20 / {t('common.perPage')}</option>
            <option value={50}>50 / {t('common.perPage')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-medium">{t('customers.customer')}</th>
                <th className="px-2 py-3 font-medium">{t('customers.email')}</th>
                <th className="px-2 py-3 font-medium">{t('customers.phone')}</th>
                <th className="px-2 py-3 font-medium">{t('customers.role')}</th>
                <th className="px-2 py-3 font-medium">{t('products.action')}</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const role = c.userRoles?.[0]?.name
                return (
                  <tr
                    key={c.userId}
                    className="border-b border-line last:border-0 hover:bg-surface"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface">
                          {c.image ? (
                            <img
                              src={imageUrl(c.image)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-muted" />
                          )}
                        </div>
                        <span className="font-medium text-ink">
                          {[c.firstName, c.lastName].filter(Boolean).join(' ') ||
                            c.userName ||
                            'Unnamed'}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-muted">{c.email || '—'}</td>
                    <td className="px-2 py-3 text-muted">
                      {c.phoneNumber || '—'}
                    </td>
                    <td className="px-2 py-3">
                      {role && (
                        <Badge
                          tone={
                            role.includes('Admin') ? 'info' : 'neutral'
                          }
                        >
                          {role}
                        </Badge>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openRoleModal(c)}
                          className="text-brand"
                          title={t('customers.changeRole')}
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setToDelete(c)}
                          className="text-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted">
                    {t('common.notFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        pageCount={pageCount}
        total={total}
        onChange={setPage}
      />

      <ConfirmModal
        open={!!toDelete}
        title={t('confirm.deleteCustomer')}
        message={t('confirm.deleteCustomerMsg')}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />

      <Modal
        open={!!roleUser}
        onClose={() => setRoleUser(null)}
        title={t('customers.changeRole')}
        footer={
          <>
            <Button variant="outline" onClick={() => setRoleUser(null)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={saveRole} disabled={savingRole}>
              {savingRole ? <Spinner className="text-white" /> : t('common.save')}
            </Button>
          </>
        }
      >
        <div className="text-ink">
          <p className="mb-3 text-sm font-medium">
            {roleUser?.userName ||
              [roleUser?.firstName, roleUser?.lastName]
                .filter(Boolean)
                .join(' ')}
          </p>
          <p className="mb-2 text-xs text-muted">{t('customers.selectRole')}</p>
          <div className="space-y-2">
            {(() => {
              // Merge API roles with the user's current roles so all roles
              // (incl. SuperAdmin) can be added or removed.
              const merged = [...roles]
              for (const r of roleUser?.userRoles ?? []) {
                if (!merged.some((m) => m.id === r.id)) merged.push(r)
              }
              return merged.map((r) => (
                <label
                  key={r.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2.5"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.has(r.id)}
                    onChange={() => toggleRole(r.id)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{r.name}</span>
                </label>
              ))
            })()}
          </div>
        </div>
      </Modal>
    </div>
  )
}
