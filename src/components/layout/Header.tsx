import { useState } from 'react'
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { userName, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const initial = (userName ?? 'A').charAt(0).toUpperCase()

  return (
    <header className="flex h-16 items-center gap-4 bg-sidebar px-6">
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search..."
          className="h-10 w-full rounded-lg bg-sidebar-hover pl-10 pr-3 text-sm text-white placeholder:text-gray-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <button className="relative text-gray-300 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
            5
          </span>
        </button>
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold">
              {initial}
            </span>
            <span className="hidden text-sm font-medium sm:block">
              {userName ?? 'Admin'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-44 rounded-lg border border-line bg-white py-1 shadow-lg">
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-surface"
              >
                <LogOut className="h-4 w-4" /> Баромадан
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
