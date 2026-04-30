import AdminSidebar from '#/components/AdminSidebar'
import AuthGuard from '#/components/AuthGuard'
import LocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { isAuthenticated } from '#/lib/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { t } = useTranslation()
  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="d-flex min-vh-100 bg-body">
        <aside
          className="d-none d-lg-flex flex-column border-end bg-body-tertiary sticky-top overflow-y-auto flex-shrink-0"
          style={{ width: '280px', height: '100vh' }}
        >
          <AdminSidebar />
        </aside>

        <div className="d-flex flex-column flex-grow-1 min-vw-0">
          <header
            className="sticky-top z-3 d-flex align-items-center gap-3 border-bottom bg-body-tertiary bg-opacity-75 px-3 px-lg-4 flex-shrink-0"
            style={{ height: '56px', backdropFilter: 'blur(10px)' }}
          >
            <div className="d-flex align-items-center gap-2 fw-bold text-danger">
              <ShieldCheck size={18} />
              <span>{t('admin_header_title')}</span>
            </div>

            <div className="ms-auto d-flex align-items-center gap-2">
              <LocaleSwitcher variant="pills" />
              <ThemeToggle />
            </div>
          </header>

          <main className="d-flex flex-grow-1 min-vh-0">
            <div className="flex-grow-1 min-vw-0 overflow-y-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
