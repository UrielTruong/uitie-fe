import { Button, Image } from 'react-bootstrap'
import { UserPlus, TrendingUp, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  FAKE_SUGGESTED_USERS,
  FAKE_TRENDING,
  FAKE_EVENTS,
} from '#/lib/fake-api'

export default function RightSidebar() {
  const { t } = useTranslation()
  return (
    <aside className="d-flex flex-column gap-4 py-4 px-3">
      {/* Trending Topics */}
      <section>
        <div className="mb-3 d-flex align-items-center gap-2">
          <TrendingUp className="text-primary" size={18} />
          <h6 className="mb-0 fw-bold">
            {t('dashboard_trending')}
          </h6>
        </div>
        <div className="d-flex flex-column gap-3">
          {FAKE_TRENDING.map((topic, idx) => (
            <div
              key={topic.id}
              className="d-flex align-items-center justify-content-between"
              style={{ cursor: 'pointer' }}
            >
              <div>
                <p className="mb-0 text-muted small">
                  #{idx + 1} &middot; Trending
                </p>
                <p className="mb-0 fw-semibold text-dark">
                  {topic.tag}
                </p>
                <p className="mb-0 text-muted small">
                  {topic.posts.toLocaleString()} posts
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-1 border-secondary" />

      {/* Suggested Users */}
      <section>
        <div className="mb-3 d-flex align-items-center gap-2">
          <UserPlus className="text-primary" size={18} />
          <h6 className="mb-0 fw-bold">
            {t('dashboard_suggested')}
          </h6>
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

      <hr className="my-1 border-secondary" />

      {/* Upcoming Events */}
      <section>
        <div className="mb-3 d-flex align-items-center gap-2">
          <Calendar className="text-primary" size={18} />
          <h6 className="mb-0 fw-bold">
            {t('dashboard_events')}
          </h6>
        </div>
        <div className="d-flex flex-column gap-3">
          {FAKE_EVENTS.map((event) => (
            <div
              key={event.id}
              className="rounded-4 border bg-body p-3"
              style={{ cursor: 'pointer' }}
            >
              <p className="mb-1 fw-semibold small leading-tight">
                {event.title}
              </p>
              <p className="mb-1 text-muted" style={{ fontSize: '0.75rem' }}>
                {event.date} &middot; {event.location}
              </p>
              <p className="mb-0 text-primary fw-medium" style={{ fontSize: '0.75rem' }}>
                {event.attendees} going
              </p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
