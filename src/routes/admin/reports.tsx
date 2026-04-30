import { createFileRoute } from '@tanstack/react-router'
import { Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/admin/reports')({
  component: AdminReportsPage,
})

function AdminReportsPage() {
  const { t } = useTranslation()
  return (
    <div className="container py-4 px-3" style={{ maxWidth: '1100px' }}>
      <h4 className="fw-bold mb-1">{t('admin_reports_title')}</h4>
      <p className="text-secondary mb-4">{t('admin_reports_subtitle')}</p>
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4 text-secondary">
          {t('admin_reports_empty')}
        </Card.Body>
      </Card>
    </div>
  )
}
