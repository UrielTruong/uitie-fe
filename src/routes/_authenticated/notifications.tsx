import { Card, Button, Badge, Form, Row, Col } from 'react-bootstrap'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  AtSign,
  Bell,
  Check,
  Heart,
  MessageCircle,
  Shield,
  UserPlus,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  FAKE_NOTIFICATIONS,
  PROFILES,
} from '#/lib/fake-api'
import type { AppNotification, NotifType } from '#/lib/fake-api'

export const Route = createFileRoute('/_authenticated/notifications')({
  component: NotificationsPage,
})

const ICONS: Record<NotifType, { Icon: LucideIcon; bg: string; color: string }> = {
  like: { Icon: Heart, bg: '#FFEDD5', color: '#C2410C' },
  comment: { Icon: MessageCircle, bg: '#DBEAFE', color: '#1D4ED8' },
  mention: { Icon: AtSign, bg: '#EDE9FE', color: '#6D28D9' },
  group: { Icon: Users, bg: '#DCFCE7', color: '#15803D' },
  follow: { Icon: UserPlus, bg: '#E0E7FF', color: '#1E3A8A' },
  system: { Icon: Shield, bg: '#F1F5F9', color: '#475569' },
}

const FILTERS: Array<{ k: string; l: string }> = [
  { k: 'all', l: 'Tất cả' },
  { k: 'unread', l: 'Chưa đọc' },
  { k: 'mention', l: 'Nhắc đến' },
  { k: 'comment', l: 'Bình luận' },
  { k: 'like', l: 'Cảm xúc' },
  { k: 'group', l: 'Nhóm' },
]

function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>(FAKE_NOTIFICATIONS)
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return items
    if (filter === 'unread') return items.filter((n) => n.unread)
    return items.filter((n) => n.type === filter)
  }, [filter, items])

  const unreadCount = items.filter((n) => n.unread).length

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  function readOne(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  return (
    <div className="container-xl py-4 px-3 px-md-4">
      <Row className="g-4">
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="fw-bold mb-1">Thông báo</h3>
              <p className="text-secondary mb-0 small">
                {unreadCount} thông báo chưa đọc
              </p>
            </div>
            <Button
              variant="link"
              className="d-flex align-items-center gap-2 text-decoration-none"
              onClick={markAllRead}
            >
              <Check size={16} /> Đánh dấu đã đọc
            </Button>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {FILTERS.map((f) => (
              <Button
                key={f.k}
                size="sm"
                variant={filter === f.k ? 'primary' : 'outline-secondary'}
                className="rounded-pill px-3 d-flex align-items-center gap-2"
                onClick={() => setFilter(f.k)}
              >
                {f.l}
                {f.k === 'unread' && unreadCount > 0 && (
                  <Badge bg="warning" text="dark" pill>
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            {filtered.length === 0 && (
              <div className="text-center py-5 text-secondary">
                <Bell size={36} className="opacity-50" />
                <div className="mt-2">Không có thông báo nào</div>
              </div>
            )}
            {filtered.map((n, i) => {
              const meta = ICONS[n.type]
              const actor = n.actor ? PROFILES[n.actor] : null
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => readOne(n.id)}
                  className={`d-flex align-items-start gap-3 px-3 py-3 text-start border-0 ${i < filtered.length - 1 ? 'border-bottom' : ''} ${n.unread ? 'bg-primary-subtle' : 'bg-body'}`}
                  style={{
                    borderLeft: n.unread
                      ? '3px solid var(--bs-warning)'
                      : '3px solid transparent',
                  }}
                >
                  <div className="position-relative flex-shrink-0">
                    {actor ? (
                      <img
                        src={actor.avatar}
                        alt={actor.name}
                        width={44}
                        height={44}
                        className="rounded-circle border bg-body-secondary"
                      />
                    ) : (
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 44,
                          height: 44,
                          background: meta.bg,
                          color: meta.color,
                        }}
                      >
                        <meta.Icon size={20} />
                      </div>
                    )}
                    <span
                      className="position-absolute bottom-0 end-0 rounded-circle border border-2 border-white d-flex align-items-center justify-content-center"
                      style={{
                        width: 22,
                        height: 22,
                        background: meta.bg,
                        color: meta.color,
                      }}
                    >
                      <meta.Icon size={11} />
                    </span>
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <div className="small">
                      {actor && (
                        <strong className="text-primary me-1">
                          {actor.name}
                        </strong>
                      )}
                      {n.text}
                    </div>
                    <div className="text-secondary" style={{ fontSize: 12 }}>
                      {n.time}
                    </div>
                  </div>
                  {n.unread && (
                    <span
                      className="rounded-circle bg-warning mt-2"
                      style={{ width: 8, height: 8 }}
                    />
                  )}
                </button>
              )
            })}
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body>
              <Card.Title className="fs-6 fw-bold mb-3">
                Cài đặt thông báo
              </Card.Title>
              {[
                ['Lượt thích & cảm xúc', true],
                ['Bình luận bài viết', true],
                ['Lời mời vào nhóm', true],
                ['Theo dõi mới', false],
                ['Thông báo hệ thống', true],
                ['Email tổng hợp hàng tuần', false],
              ].map(([label, on], i, arr) => (
                <div
                  key={i}
                  className={`d-flex justify-content-between align-items-center py-2 ${i < arr.length - 1 ? 'border-bottom' : ''}`}
                >
                  <span className="small">{label}</span>
                  <Form.Check
                    type="switch"
                    defaultChecked={on as boolean}
                    aria-label={label as string}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
