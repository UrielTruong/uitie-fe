import { Card, Button, Badge, Form, InputGroup, Nav, Row, Col } from 'react-bootstrap'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  Calendar,
  Check,
  FileText,
  Lock,
  MessageSquare,
  Plus,
  Search,
  Shield,
  Users,
} from 'lucide-react'
import { FAKE_GROUPS, PROFILES } from '#/lib/fake-api'
import type { Group } from '#/lib/fake-api'

export const Route = createFileRoute('/_authenticated/groups')({
  component: GroupsPage,
})

const FILTERS: Array<{ k: string; l: string }> = [
  { k: 'all', l: 'Tất cả' },
  { k: 'mine', l: 'Của tôi' },
  { k: 'club', l: 'Câu lạc bộ' },
  { k: 'class', l: 'Lớp học phần' },
  { k: 'alumni', l: 'Alumni' },
  { k: 'suggest', l: 'Gợi ý' },
]

function GroupsPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<Group | null>(null)

  const filtered = useMemo(() => {
    return FAKE_GROUPS.filter((g) => {
      if (filter === 'mine') return g.role === 'member' || g.role === 'admin'
      if (filter === 'suggest') return g.role === 'none'
      return true
    }).filter(
      (g) => !search || g.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [filter, search])

  if (detail) {
    return <GroupDetail group={detail} onBack={() => setDetail(null)} />
  }

  return (
    <div className="container-xl py-4 px-3 px-md-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Nhóm & Cộng đồng</h3>
          <p className="text-secondary mb-0">
            Kết nối lớp học phần, câu lạc bộ và mạng lưới cựu sinh viên.
          </p>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2">
          <Plus size={16} /> Tạo nhóm mới
        </Button>
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <InputGroup className="flex-grow-1" style={{ maxWidth: 380 }}>
          <InputGroup.Text className="bg-body-secondary border-0">
            <Search size={16} className="text-secondary" />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm nhóm theo tên hoặc mô tả…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-body-secondary border-0"
          />
        </InputGroup>
        <div className="d-flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f.k}
              variant={filter === f.k ? 'primary' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => setFilter(f.k)}
            >
              {f.l}
            </Button>
          ))}
        </div>
      </div>

      <Row xs={1} sm={2} lg={3} xxl={4} className="g-3">
        {filtered.map((g) => (
          <Col key={g.id}>
            <GroupCard group={g} onOpen={() => setDetail(g)} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

function GroupCard({ group, onOpen }: { group: Group; onOpen: () => void }) {
  const roleLabel = {
    admin: 'Trưởng nhóm',
    member: 'Đã tham gia',
    pending: 'Chờ duyệt',
    none: null,
  }[group.role]

  return (
    <Card
      className="border-0 shadow-sm rounded-4 overflow-hidden h-100"
      style={{ cursor: 'pointer' }}
      onClick={onOpen}
    >
      <div
        className="position-relative"
        style={{ height: 96, background: group.cover }}
      >
        <Badge
          bg="light"
          text="primary"
          className="position-absolute top-0 start-0 m-2 fw-bold"
        >
          {group.kind}
        </Badge>
      </div>
      <Card.Body>
        <Card.Title className="fs-6 fw-bold mb-1">{group.name}</Card.Title>
        <div className="d-flex align-items-center gap-1 text-secondary small mb-2">
          <Users size={13} /> {group.members.toLocaleString()} thành viên
        </div>
        <Card.Text
          className="text-secondary small mb-3"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {group.desc}
        </Card.Text>

        {group.role === 'none' && (
          <Button variant="primary" size="sm" className="w-100" onClick={(e) => e.stopPropagation()}>
            Tham gia nhóm
          </Button>
        )}
        {group.role === 'pending' && (
          <Button variant="light" size="sm" className="w-100 border" disabled>
            Đang chờ phê duyệt
          </Button>
        )}
        {(group.role === 'member' || group.role === 'admin') && (
          <Button
            variant="outline-primary"
            size="sm"
            className="w-100 d-flex align-items-center justify-content-center gap-2"
          >
            {group.role === 'admin' ? <Shield size={14} /> : <Check size={14} />}
            {roleLabel}
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

const DETAIL_TABS = [
  { k: 'discuss', l: 'Thảo luận', Icon: MessageSquare },
  { k: 'docs', l: 'Tài liệu chia sẻ', Icon: FileText },
  { k: 'members', l: 'Thành viên', Icon: Users },
  { k: 'events', l: 'Sự kiện', Icon: Calendar },
] as const

function GroupDetail({ group, onBack }: { group: Group; onBack: () => void }) {
  const [tab, setTab] = useState<string>('discuss')

  return (
    <div>
      <div
        className="position-relative"
        style={{ height: 220, background: group.cover }}
      >
        <Button
          size="sm"
          variant="light"
          onClick={onBack}
          className="position-absolute top-0 start-0 m-3 d-flex align-items-center gap-2 fw-semibold"
        >
          <ArrowLeft size={15} /> Tất cả nhóm
        </Button>
      </div>

      <div className="bg-body border-bottom">
        <div className="container-xl px-3 px-md-4 py-4">
          <div className="d-flex flex-wrap align-items-start gap-3 mb-3">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className="text-uppercase fw-bold small text-warning">
                  {group.kind}
                </span>
                {group.role === 'admin' && (
                  <Badge bg="danger-subtle" text="danger-emphasis" className="border">
                    Bạn là Trưởng nhóm
                  </Badge>
                )}
              </div>
              <h3 className="fw-bold mb-2">{group.name}</h3>
              <p className="text-secondary mb-3" style={{ maxWidth: 640 }}>
                {group.desc}
              </p>
              <div className="d-flex flex-wrap gap-3 small text-secondary">
                <span className="d-flex align-items-center gap-1">
                  <Users size={14} /> {group.members.toLocaleString()} thành viên
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Lock size={14} /> Nhóm{' '}
                  {group.role === 'none' ? 'công khai' : 'riêng tư'}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Calendar size={14} /> Hoạt động từ 2021
                </span>
              </div>
            </div>
            <div className="d-flex gap-2">
              {group.role === 'none' ? (
                <Button variant="primary">Tham gia nhóm</Button>
              ) : (
                <>
                  <Button variant="outline-primary" className="d-flex align-items-center gap-2">
                    <Bell size={15} /> Thông báo
                  </Button>
                  <Button variant="light" className="border d-flex align-items-center gap-2">
                    <Check size={15} /> Đã tham gia
                  </Button>
                </>
              )}
            </div>
          </div>

          <Nav
            variant="underline"
            activeKey={tab}
            onSelect={(k) => k && setTab(k)}
          >
            {DETAIL_TABS.map(({ k, l, Icon }) => (
              <Nav.Item key={k}>
                <Nav.Link
                  eventKey={k}
                  className="d-flex align-items-center gap-2 fw-semibold"
                >
                  <Icon size={15} /> {l}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
      </div>

      <div className="container-xl py-4 px-3 px-md-4">
        {tab === 'discuss' && <DiscussTab />}
        {tab === 'docs' && <DocsTab />}
        {tab === 'members' && <MembersTab />}
        {tab === 'events' && <EventsTab />}
      </div>
    </div>
  )
}

function DiscussTab() {
  return (
    <Row className="g-4">
      <Col lg={8}>
        <Card className="border-0 shadow-sm rounded-4 text-center py-5">
          <Card.Body>
            <MessageSquare size={36} className="text-secondary opacity-50" />
            <p className="mt-3 mb-0 text-secondary">
              Chưa có thảo luận nào trong nhóm.
            </p>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={4}>
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body>
            <Card.Title className="fs-6 fw-bold mb-3">Quy tắc nhóm</Card.Title>
            {[
              'Tôn trọng mọi thành viên',
              'Không spam / quảng cáo',
              'Chỉ chia sẻ tài liệu có nguồn rõ ràng',
              'Sử dụng hashtag môn học phù hợp',
            ].map((r, i) => (
              <div key={i} className="d-flex gap-2 py-2 small">
                <Badge
                  bg="primary-subtle"
                  text="primary-emphasis"
                  className="rounded-circle"
                  style={{ width: 22, height: 22, lineHeight: '14px' }}
                >
                  {i + 1}
                </Badge>
                <span>{r}</span>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

function DocsTab() {
  const docs = [
    { n: 'CTDLGT_OnTap_2024.pdf', s: '4.2 MB', who: 'Trần Bảo Linh', t: '2 giờ trước', d: 124 },
    { n: 'DeCuongMon_IT002.docx', s: '1.1 MB', who: 'TS. Phạm Quốc Huy', t: 'hôm qua', d: 89 },
    { n: 'Slide_Chuong5_Graph.pdf', s: '2.8 MB', who: 'Lê Thu Hằng', t: '2 ngày', d: 56 },
    { n: 'Source_DoAn_BackendAPI.zip', s: '12.4 MB', who: 'Võ Đăng Khoa', t: '3 ngày', d: 34 },
  ]
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
      <Card.Header className="bg-body d-flex justify-content-between align-items-center py-3">
        <span className="fw-bold">Tài liệu chia sẻ</span>
        <Button size="sm" variant="primary" className="d-flex align-items-center gap-2">
          <Plus size={14} /> Tải lên
        </Button>
      </Card.Header>
      {docs.map((d, i) => {
        const ext = d.n.split('.').pop()!.toUpperCase()
        return (
          <div
            key={i}
            className="d-flex align-items-center gap-3 px-3 py-3 border-bottom"
            style={{ cursor: 'pointer' }}
          >
            <div
              className="rounded fw-bold d-flex align-items-center justify-content-center"
              style={{
                width: 44,
                height: 44,
                fontSize: 11,
                background:
                  ext === 'PDF' ? '#FEE2E2' : ext === 'ZIP' ? '#FFEDD5' : '#E0E7FF',
                color:
                  ext === 'PDF' ? '#991B1B' : ext === 'ZIP' ? '#9A3412' : '#1E3A8A',
              }}
            >
              {ext}
            </div>
            <div className="flex-grow-1 min-w-0">
              <div className="fw-semibold text-truncate">{d.n}</div>
              <div className="text-secondary small">
                {d.who} · {d.t} · {d.s} · {d.d} lượt tải
              </div>
            </div>
          </div>
        )
      })}
    </Card>
  )
}

function MembersTab() {
  const members = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'me']
  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Header className="bg-body d-flex justify-content-between align-items-center py-3">
        <div>
          <div className="fw-bold">Thành viên nhóm</div>
          <div className="text-secondary small">
            {members.length} người đang tham gia
          </div>
        </div>
        <InputGroup style={{ maxWidth: 240 }}>
          <InputGroup.Text className="bg-body-secondary border-0">
            <Search size={14} />
          </InputGroup.Text>
          <Form.Control
            size="sm"
            placeholder="Tìm thành viên…"
            className="bg-body-secondary border-0"
          />
        </InputGroup>
      </Card.Header>
      <Card.Body>
        <Row xs={1} sm={2} md={3} className="g-3">
          {members.map((id) => {
            const u = PROFILES[id]
            if (!u) return null
            return (
              <Col key={id}>
                <div className="d-flex align-items-center gap-2 p-2 border rounded-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    width={44}
                    height={44}
                    className="rounded-circle border bg-body-secondary"
                  />
                  <div className="flex-grow-1 min-w-0">
                    <div className="fw-semibold text-truncate">{u.name}</div>
                    <div className="text-secondary small">{u.major}</div>
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      </Card.Body>
    </Card>
  )
}

function EventsTab() {
  return (
    <Card className="border-0 shadow-sm rounded-4 text-center py-5">
      <Card.Body>
        <Calendar size={40} className="text-secondary opacity-50" />
        <h6 className="mt-3 fw-bold">Chưa có sự kiện nào</h6>
        <p className="text-secondary mb-0 small">
          Trưởng nhóm có thể tạo sự kiện mới cho cả nhóm.
        </p>
      </Card.Body>
    </Card>
  )
}
