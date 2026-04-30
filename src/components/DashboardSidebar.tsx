import { Link, useNavigate } from '@tanstack/react-router'
import {
  Home,
  Users,
  MessageCircle,
  Bell,
  User,
  Settings,
  Bookmark,
  LogOut,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStore } from '@tanstack/react-store'
import { authStore, clearAuth } from '#/lib/auth'
import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { key: 'nav_home', icon: Home, to: '/dashboard' },
  { key: 'nav_profile', icon: User, to: '/profile' },
  { key: 'nav_groups', icon: Users, to: '/groups' },
  { key: 'nav_messages', icon: MessageCircle, to: '/messages' },
  { key: 'nav_notifications', icon: Bell, to: '/notifications' },
  { key: 'nav_bookmarks', icon: Bookmark, to: '/dashboard' },
  { key: 'nav_settings', icon: Settings, to: '/dashboard' },
] as const

interface DashboardSidebarProps {
  className?: string
}

export default function DashboardSidebar({
  className = '',
}: DashboardSidebarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useStore(authStore, (s) => s.user)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleLogout() {
    clearAuth()
    void navigate({ to: '/login' })
  }

  const labels: Record<string, string> = {
    nav_home: t('nav_home'),
    nav_groups: t('nav_groups'),
    nav_messages: t('nav_messages'),
    nav_notifications: t('nav_notifications'),
    nav_profile: t('nav_profile'),
    nav_bookmarks: t('nav_bookmarks'),
    nav_settings: t('nav_settings'),
  }

  return (
    <aside
      className={`d-flex flex-column justify-content-between py-4 px-3 h-100 ${className}`}
    >
      {/* Logo */}
      <div>
        <div className="mb-4 px-3">
          <span className="fs-4 fw-black text-primary">UITie</span>
        </div>

        {/* Nav items */}
        <nav className="d-flex flex-column gap-1">
          {NAV_ITEMS.map(({ key, icon: Icon, to }) => (
            <Link
              key={key}
              to={to}
              className="d-flex align-items-center gap-3 rounded px-3 py-2 text-decoration-none text-secondary fw-medium border-0 bg-transparent"
              activeProps={{
                className: 'text-primary bg-primary bg-opacity-10 fw-bold',
              }}
            >
              <Icon size={20} />
              <span>{labels[key]}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* User + Logout */}
      <div className="d-flex flex-column gap-3 mt-4">
        {/* User card — luôn render để tránh hydration mismatch */}
        <div className="d-flex align-items-center gap-3 rounded bg-body-tertiary p-2 border">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-body-secondary flex-shrink-0"
            style={{ width: '40px', height: '40px' }}
          >
            <span className="text-secondary small">
              {mounted ? (user?.email?.charAt(0).toUpperCase() ?? '?') : ''}
            </span>
          </div>
          <div className="text-truncate flex-grow-1">
            <p className="mb-0 fw-bold fs-6 text-truncate">
              {mounted ? (user?.name ?? '') : ''}
            </p>
            <p className="mb-0 text-secondary small text-truncate">
              {mounted ? (user?.email ?? '') : ''}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          id="sidebar-logout-btn"
          className="btn btn-outline-danger d-flex align-items-center gap-2 w-100 justify-content-center"
        >
          <LogOut size={20} />
          <span>{t('nav_logout')}</span>
        </button>
      </div>
    </aside>
  )
}
