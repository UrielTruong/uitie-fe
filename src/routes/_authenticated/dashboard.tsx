import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fakeFetchFeed } from '#/lib/fake-api'
import FeedPostCard from '#/components/FeedPostCard'
import { Spinner, Card } from 'react-bootstrap'
import { ImagePlus, Smile, Video } from 'lucide-react'
import { getUser } from '#/lib/auth'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { t } = useTranslation()
  const user = getUser()

  const { data: posts, isLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: fakeFetchFeed,
  })

  return (
    <div className="container py-4 px-3" style={{ maxWidth: '600px' }}>
      {/* Feed header */}
      <h4 className="fw-bold mb-4">
        {t('dashboard_feed_title')}
      </h4>

      {/* Compose post box */}
      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <Card.Body className="p-3">
          <div className="d-flex align-items-center gap-3 mb-3">
            {/* <img
              src={
                user?.avatar ??
                'https://api.dicebear.com/9.x/avataaars/svg?seed=anon'
              }
              alt={user?.name ?? 'User'}
              className="rounded-circle object-fit-cover border"
              style={{ width: '40px', height: '40px' }}
            /> */}
            <input
              type="text"
              id="compose-post"
              placeholder="Bạn đang nghĩ gì?"
              className="form-control rounded-pill bg-body-secondary border-0 cursor-pointer text-muted"
              readOnly
            />
          </div>
          <div className="d-flex align-items-center gap-2 pt-2 border-top">
            <button
              type="button"
              className="btn bg-body-secondary border-0 btn-sm d-flex align-items-center gap-2 fw-medium rounded-pill px-3"
            >
              <ImagePlus size={18} className="text-success" />
              <span className="text-secondary small">Ảnh/Video</span>
            </button>
            <button
              type="button"
              className="btn bg-body-secondary border-0 btn-sm d-flex align-items-center gap-2 fw-medium rounded-pill px-3"
            >
              <Video size={18} className="text-danger" />
              <span className="text-secondary small">Trực tiếp</span>
            </button>
            <button
              type="button"
              className="btn bg-body-secondary border-0 btn-sm d-flex align-items-center gap-2 fw-medium rounded-pill px-3"
            >
              <Smile size={18} className="text-warning" />
              <span className="text-secondary small">Cảm xúc</span>
            </button>
          </div>
        </Card.Body>
      </Card>

      {/* Feed posts */}
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="d-flex flex-column">
          {posts?.map((post) => (
             <FeedPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
