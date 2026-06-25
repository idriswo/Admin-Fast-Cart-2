import { useEffect, useState } from 'react'
import { Trash2, User, Search } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Badge } from '@/components/ui/Badge'
import { LoadingState } from '@/components/ui/Spinner'
import { imageUrl } from '@/lib/utils'
import { getCustomers, deleteCustomer } from '@/services/customer.service'
import type { UserProfile } from '@/types'

export function CustomersPage() {
  const [customers, setCustomers] = useState<UserProfile[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [toDelete, setToDelete] = useState<UserProfile | null>(null)
  const [deleting, setDeleting] = useState(false)

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
      <PageHeader title="Customers" />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username..."
            className="h-11 w-72 rounded-lg border border-line bg-white pl-3.5 pr-9 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-muted">Show</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
            className="h-11 rounded-lg border border-line bg-white px-3 text-sm focus:border-brand focus:outline-none"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-2 py-3 font-medium">Email</th>
                <th className="px-2 py-3 font-medium">Phone</th>
                <th className="px-2 py-3 font-medium">Role</th>
                <th className="px-2 py-3 font-medium">Action</th>
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
                      <button
                        onClick={() => setToDelete(c)}
                        className="text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted">
                    Муштарӣ ёфт нашуд.
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
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
