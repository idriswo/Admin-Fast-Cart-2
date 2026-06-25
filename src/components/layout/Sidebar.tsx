import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ListOrdered,
  Tag,
  FolderOpen,
  Users,
} from 'lucide-react'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: ListOrdered },
  { to: '/products', label: 'Products', icon: Tag },
  { to: '/categories', label: 'Other', icon: FolderOpen },
  { to: '/customers', label: 'Customers', icon: Users },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar lg:flex">
      <div className="flex h-16 items-center px-6">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white text-ink'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
  
}
