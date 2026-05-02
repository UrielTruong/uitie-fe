import { useGetPostList, useValidatePost } from '#/api/useAdmin'
import { createFileRoute } from '@tanstack/react-router'
import { Check, X } from 'lucide-react'
import { Badge, Button, Card, Spinner, Table } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/admin/posts')({
  component: AdminPostsPage,
})

const STATUS_VARIANT: Record<string, string> = {
  Pending: 'warning',
  Accepted: 'success',
  Rejected: 'danger',
}

const VISIBILITY_VARIANT: Record<string, string> = {
  Public: 'primary',
  Private: 'secondary',
}

function AdminPostsPage() {
  const { t } = useTranslation()

  const { data, isLoading, isError } = useGetPostList()
  const posts = data?.data?.data?.posts ?? []

  const { mutate: validatePost, isPending: isValidating } = useValidatePost()

  const handleAccept = (id: number) => {
    validatePost(
      { id, status: 'Accepted' },
      { onSuccess: () => toast.success('Post accepted') },
    )
  }

  const handleReject = (id: number) => {
    validatePost(
      { id, status: 'Rejected' },
      { onSuccess: () => toast.success('Post rejected') },
    )
  }

  return (
    <div className="container py-4 px-3" style={{ maxWidth: '1100px' }}>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">{t('admin_posts_title')}</h4>
        <p className="text-secondary mb-0">{t('admin_posts_subtitle')}</p>
      </div>

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
                  <th className="px-4 py-3">{t('admin_posts_col_no')}</th>
                  <th className="py-3">{t('admin_posts_col_author')}</th>
                  <th className="py-3">{t('admin_posts_col_content')}</th>
                  <th className="py-3">{t('admin_posts_col_category')}</th>
                  <th className="py-3">{t('admin_posts_col_visibility')}</th>
                  <th className="py-3">{t('admin_posts_col_status')}</th>
                  <th className="py-3" style={{ width: '120px' }}>
                    {t('admin_posts_col_action')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-secondary py-4">
                      {t('admin_posts_empty')}
                    </td>
                  </tr>
                ) : (
                  posts?.map((p, index) => (
                    <tr key={p.id}>
                      <td className="px-4">{index + 1}</td>
                      <td>{p.author?.full_name ?? p.author?.email ?? '—'}</td>
                      <td style={{ maxWidth: '320px' }}>
                        <span
                          className="d-inline-block text-truncate"
                          style={{ maxWidth: '300px' }}
                          title={p.content ?? ''}
                        >
                          {p.content ?? '—'}
                        </span>
                      </td>
                      <td>{p.category?.category_name ?? '—'}</td>
                      <td>
                        <Badge
                          bg={VISIBILITY_VARIANT[p.visibility] ?? 'secondary'}
                        >
                          {p.visibility}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={STATUS_VARIANT[p.status] ?? 'secondary'}>
                          {p.status}
                        </Badge>
                      </td>
                      <td>
                        {p.status === 'Pending' ? (
                          <>
                            <Button
                              variant="link"
                              className="text-decoration-none p-2 rounded-3 text-success"
                              title="Accept"
                              disabled={isValidating}
                              onClick={() => handleAccept(p.id)}
                            >
                              <Check size={18} />
                            </Button>
                            <Button
                              variant="link"
                              className="text-decoration-none p-2 rounded-3 text-danger"
                              title="Reject"
                              disabled={isValidating}
                              onClick={() => handleReject(p.id)}
                            >
                              <X size={18} />
                            </Button>
                          </>
                        ) : null}
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
