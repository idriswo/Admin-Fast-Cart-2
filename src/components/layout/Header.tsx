import { useState } from 'react'
import { Search, Bell, ChevronDown, LogOut, Sun, Moon, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import { languages } from '@/i18n'

export function Header() {
  const { t, i18n } = useTranslation()
  const { userName, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const navigate = useNavigate()
  const initial = (userName ?? 'A').charAt(0).toUpperCase()
  const currentLang =
    languages.find((l) => l.code === i18n.language)?.code.toUpperCase() ?? 'TJ'

  return (
    <header className="flex h-16 items-center gap-4 bg-sidebar px-6">
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          placeholder={t('common.search')}
          className="h-10 w-full rounded-lg bg-sidebar-hover pl-10 pr-3 text-sm text-white placeholder:text-gray-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-300 hover:bg-sidebar-hover hover:text-white"
          >
            <Globe className="h-4 w-4" />
            {currentLang}
          </button>
          {langOpen && (
            <div className="absolute right-0 top-11 z-20 w-32 rounded-lg border border-line bg-card py-1 shadow-lg">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    i18n.changeLanguage(l.code)
                    setLangOpen(false)
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-surface"
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="text-gray-300 hover:text-white"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <button className="relative text-gray-300 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
            5
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
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
          {menuOpen && (
            <div className="absolute right-0 top-12 z-20 w-44 rounded-lg border border-line bg-card py-1 shadow-lg">
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-surface"
              >
                <LogOut className="h-4 w-4" /> {t('common.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
