import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ListOrdered,
  Tag,
  FolderOpen,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/', key: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', key: 'nav.orders', icon: ListOrdered },
  { to: '/products', key: 'nav.products', icon: Tag },
  { to: '/categories', key: 'nav.other', icon: FolderOpen },
  { to: '/customers', key: 'nav.customers', icon: Users },
]

export function Sidebar() {
  const { t } = useTranslation()
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar lg:flex">
      <div className="flex h-16 items-center px-6">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
        {nav.map(({ to, key, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white text-sidebar'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{t(key)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
  
}
