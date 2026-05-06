import { Button, Image } from 'react-bootstrap'
import { UserPlus, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FAKE_SUGGESTED_USERS, type Category } from '#/lib/fake-api'
import { CATEGORIES } from '#/types/category'

export default function RightSidebar() {
  const { t } = useTranslation()
  return (
    <aside className="d-flex flex-column gap-4 py-4 px-3">
      {/* Trending Topics
       */}
      <div className="mb-3 d-flex align-items-center gap-2">
        <TrendingUp className="text-primary" size={18} />
        <h6 className="mb-0 fw-bold">{t('dashboard_trending')}</h6>
      </div>
      {CATEGORIES.map((category: Category) => (
        <div key={category.id} className="d-flex align-items-center gap-2">
          <h6 className="mb-0 fw-bold">{category.category_name}</h6>
          <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
            {Math.floor(Math.random() * 1000)} posts
          </p>
        </div>
      ))}

      <hr className="my-1 border-secondary" />

      {/* Suggested Users */}
      <section>
        <div className="mb-3 d-flex align-items-center gap-2">
          <UserPlus className="text-primary" size={18} />
          <h6 className="mb-0 fw-bold">{t('dashboard_suggested')}</h6>
        </div>
        <div className="d-flex flex-column gap-3">
          {FAKE_SUGGESTED_USERS.map((user) => (
            <div key={user.id} className="d-flex align-items-center gap-2">
              <Image
                src={user.avatar}
                alt={user.name}
                roundedCircle
                width={40}
                height={40}
                className="object-fit-cover border"
              />
              <div className="flex-grow-1 text-truncate">
                <p className="mb-0 fw-semibold text-truncate small">
                  {user.name}
                </p>
                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                  {user.mutualFriends} mutual friends
                </p>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-pill fw-medium py-1 px-3"
                style={{ fontSize: '0.8rem' }}
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
