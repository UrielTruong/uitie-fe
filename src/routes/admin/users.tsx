import { createFileRoute } from '@tanstack/react-router'
import { Card, Spinner, Table, Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useGetUserList } from '#/api/useAdmin'

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useGetUserList()
  const users = data?.data?.data ?? []

  return (
    <div className="container py-4 px-3" style={{ maxWidth: '1100px' }}>
      <h4 className="fw-bold mb-1">{t('admin_users_title')}</h4>
      <p className="text-secondary mb-4">{t('admin_users_subtitle')}</p>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : isError ? (
            <div className="p-4 text-danger">{t('error_generic')}</div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-body-tertiary">
                <tr>
                  <th className="px-4 py-3">{t('admin_users_col_name')}</th>
                  <th className="py-3">{t('admin_users_col_email')}</th>
                  <th className="py-3">{t('admin_users_col_role')}</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-secondary py-4">
                      {t('admin_users_empty')}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4">{u.name ?? '—'}</td>
                      <td>{u.email}</td>
                      <td>
                        <Badge
                          bg={
                            u.role === 'SUPER_ADMIN'
                              ? 'dark'
                              : u.role === 'ADMIN'
                              ? 'danger'
                              : 'secondary'
                          }
                        >
                          {u.role ?? 'STUDENT'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}
