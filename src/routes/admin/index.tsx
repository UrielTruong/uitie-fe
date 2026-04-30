import { createFileRoute, Link } from '@tanstack/react-router'
import { Card } from 'react-bootstrap'
import { Users, FileText, Flag, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/admin/')({
  component: AdminOverviewPage,
})

const STATS = [
  { key: 'admin_stat_users', value: '1,284', icon: Users, to: '/admin/users', color: 'text-primary' },
  { key: 'admin_stat_posts', value: '5,612', icon: FileText, to: '/admin/posts', color: 'text-success' },
  { key: 'admin_stat_reports', value: '23', icon: Flag, to: '/admin/reports', color: 'text-danger' },
  { key: 'admin_stat_active', value: '342', icon: TrendingUp, to: '/admin', color: 'text-warning' },
] as const

function AdminOverviewPage() {
  const { t } = useTranslation()

  return (
    <div className="container py-4 px-3" style={{ maxWidth: '1100px' }}>
      <h4 className="fw-bold mb-1">{t('admin_overview_title')}</h4>
      <p className="text-secondary mb-4">{t('admin_overview_subtitle')}</p>

      <div className="row g-3">
        {STATS.map(({ key, value, icon: Icon, to, color }) => (
          <div key={key} className="col-12 col-sm-6 col-lg-3">
            <Link to={to} className="text-decoration-none">
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-3 d-flex align-items-center gap-3">
                  <div
                    className={`rounded-3 d-flex align-items-center justify-content-center bg-body-secondary ${color}`}
                    style={{ width: '48px', height: '48px' }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="mb-0 small text-secondary">{t(key)}</p>
                    <p className="mb-0 fs-4 fw-bold text-body">{value}</p>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
