import { Card, Button, Badge, Image, Nav, Row, Col } from 'react-bootstrap'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Camera,
  Check,
  MessageSquare,
  Settings as SettingsIcon,
  UserPlus,
  BookOpen,
} from 'lucide-react'
import { PROFILES } from '#/lib/fake-api'
import type { Profile, UserRole } from '#/lib/fake-api'

export const Route = createFileRoute('/_authenticated/profile')({
  validateSearch: (search: Record<string, unknown>) => ({
    user: typeof search.user === 'string' ? search.user : undefined,
  }),
  component: ProfilePage,
})

const ROLE_BADGE: Record<
  UserRole,
  { label: string; bg: string; text: string }
> = {
  student: { label: 'Sinh viên', bg: 'info-subtle', text: 'info-emphasis' },
  lecturer: {
    label: 'Giảng viên',
    bg: 'primary-subtle',
    text: 'primary-emphasis',
  },
  alumni: { label: 'Cựu SV', bg: 'warning-subtle', text: 'warning-emphasis' },
  admin: { label: 'Admin', bg: 'danger-subtle', text: 'danger-emphasis' },
}

function RoleBadge({ role }: { role: UserRole }) {
  const r = ROLE_BADGE[role]
  return (
    <Badge bg={r.bg} text={r.text} className="border fw-semibold">
      {r.label}
    </Badge>
  )
}

function ProfilePage() {
  const { user: userId } = Route.useSearch()
  const profile: Profile = (userId && PROFILES[userId]) || PROFILES.me
  const isMe = profile.id === 'me'
  const [tab, setTab] = useState<string>('posts')
  const [following, setFollowing] = useState(!isMe)

  const friends = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6']
    .map((id) => PROFILES[id])
    .filter(Boolean)

  return (
    <div>
      {/* Cover */}
      <div
        className="position-relative"
        style={{
          height: 240,
          background: 'linear-gradient(120deg,#1E3A8A,#3B82F6)',
        }}
      >
        {isMe && (
          <Button
            size="sm"
            variant="light"
            className="position-absolute end-0 bottom-0 m-3 d-flex align-items-center gap-2 fw-semibold"
          >
            <Camera size={15} /> Đổi ảnh bìa
          </Button>
        )}
      </div>

      {/* Header */}
      <div className="bg-body border-bottom">
        <div className="container-xl px-3 px-md-4">
          <div
            className="d-flex flex-column flex-md-row align-items-md-end gap-3 pb-3"
            style={{ marginTop: -56 }}
          >
            <div
              className="position-relative"
              style={{ width: 140, height: 140 }}
            >
              <Image
                src={profile.avatar}
                roundedCircle
                width={140}
                height={140}
                className="border border-4 border-body shadow-sm bg-body"
              />
              {isMe && (
                <Button
                  variant="primary"
                  className="position-absolute bottom-0 end-0 rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: 36, height: 36 }}
                >
                  <Camera size={16} />
                </Button>
              )}
            </div>

            <div className="flex-grow-1 pt-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h3 className="mb-0 fw-bold">{profile.name}</h3>
                <RoleBadge role={profile.role} />
              </div>
              <p className="mb-2 text-secondary small">
                {profile.major} · {profile.faculty}
                {profile.year ? ` · ${profile.year}` : ''}
              </p>
              {profile.bio && (
                <p
                  className="mb-2 text-body-secondary"
                  style={{ maxWidth: 560 }}
                >
                  {profile.bio}
                </p>
              )}
              <div className="d-flex gap-3 small">
                <span>
                  <strong>248</strong>{' '}
                  <span className="text-secondary">bài viết</span>
                </span>
                <span>
                  <strong>1.2K</strong>{' '}
                  <span className="text-secondary">người theo dõi</span>
                </span>
                <span>
                  <strong>384</strong>{' '}
                  <span className="text-secondary">đang theo dõi</span>
                </span>
              </div>
            </div>

            <div className="d-flex gap-2">
              {isMe ? (
                <Button
                  variant="outline-primary"
                  className="d-flex align-items-center gap-2"
                >
                  <SettingsIcon size={16} /> Chỉnh sửa hồ sơ
                </Button>
              ) : (
                <>
                  <Button
                    variant={following ? 'light' : 'primary'}
                    onClick={() => setFollowing((p) => !p)}
                    className="d-flex align-items-center gap-2 border"
                  >
                    {following ? <Check size={16} /> : <UserPlus size={16} />}
                    {following ? 'Đang theo dõi' : 'Theo dõi'}
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2"
                  >
                    <MessageSquare size={16} /> Nhắn tin
                  </Button>
                </>
              )}
            </div>
          </div>

          <Nav
            variant="underline"
            activeKey={tab}
            onSelect={(k) => k && setTab(k)}
            className="border-0"
          >
            {[
              ['posts', 'Bài viết'],
              ['about', 'Về tôi'],
              ['friends', 'Bạn bè'],
              ['photos', 'Ảnh'],
              ['docs', 'Tài liệu'],
            ].map(([k, l]) => (
              <Nav.Item key={k}>
                <Nav.Link eventKey={k} className="fw-semibold">
                  {l}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
      </div>

      {/* Body */}
      <div className="container-xl py-4 px-3 px-md-4">
        <Row className="g-4">
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 mb-3">
              <Card.Body>
                <Card.Title className="fs-6 fw-bold mb-3">
                  Thông tin học thuật
                </Card.Title>
                {[
                  ['Khoa', profile.faculty],
                  ['Ngành', profile.major],
                  ['Khoá', profile.year ?? '—'],
                  ['Email', `${profile.handle}@student.uit.edu.vn`],
                  profile.job ? ['Hiện đang', profile.job] : null,
                ]
                  .filter((r): r is [string, string] => Array.isArray(r))
                  .map(([k, v]) => (
                    <div
                      key={k}
                      className="d-flex justify-content-between py-2 border-bottom small"
                    >
                      <span className="text-secondary">{k}</span>
                      <span className="fw-semibold text-end">{v}</span>
                    </div>
                  ))}
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Card.Title className="fs-6 fw-bold mb-0">
                    Bạn bè{' '}
                    <span className="text-secondary fw-normal">· 384</span>
                  </Card.Title>
                  <a className="small fw-semibold text-decoration-none">
                    Xem tất cả
                  </a>
                </div>
                <Row xs={3} className="g-2">
                  {friends.map((f) => (
                    <Col key={f.id} className="text-center">
                      <Image
                        src={f.avatar}
                        rounded
                        width="100%"
                        className="object-fit-cover"
                        style={{ aspectRatio: '1/1' }}
                      />
                      <div className="small text-truncate mt-1" title={f.name}>
                        {f.name.split(' ').slice(-2).join(' ')}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 text-center py-5">
              <Card.Body>
                <BookOpen size={36} className="text-secondary opacity-50" />
                <p className="mt-3 mb-0 text-secondary">
                  Chưa có nội dung trong tab "{tab}".
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
