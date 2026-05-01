import { exportReportsPdf } from '#/api/useAdmin'
import { createFileRoute } from '@tanstack/react-router'
import { FileDown } from 'lucide-react'
import { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/admin/reports')({
  component: AdminReportsPage,
})

function AdminReportsPage() {
  const { t } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)
  const handleExportPdf = async () => {
    setIsExporting(true)
    try {
      await exportReportsPdf()
    } finally {
      setIsExporting(false)
    }
  }
  return (
    <div className="container py-4 px-3" style={{ maxWidth: '1100px' }}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-1">{t('admin_reports_title')}</h4>
          <p className="text-secondary mb-4">{t('admin_reports_subtitle')}</p>
        </div>
        <Button
          variant="outline-danger"
          className="d-flex align-items-center gap-2"
          onClick={handleExportPdf}
          disabled={isExporting}
        >
          <FileDown size={18} />
          <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
        </Button>
      </div>
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4 text-secondary">
          {t('admin_reports_empty')}
        </Card.Body>
      </Card>
    </div>
  )
}
