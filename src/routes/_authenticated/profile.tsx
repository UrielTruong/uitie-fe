import { Card, Button, Badge, Image, Nav, Row, Col, Modal, Form, Spinner } from 'react-bootstrap'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
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
import axios from 'axios'

export const Route = createFileRoute('/_authenticated/profile')({
  validateSearch: (search: Record<string, unknown>) => {
    const validSearch: { user?: string } = {}
    if (typeof search.user === 'string') {
      validSearch.user = search.user
    }
    return validSearch
  },
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
  const isMe = !userId

  // Khởi tạo trạng thái rỗng/loading thay vì dùng dữ liệu giả PROFILES.me
  const initialProfile = (userId && (PROFILES as any)[userId]) || {
    id: '',
    name: 'Đang tải...',
    email: '',
    phone_number: '',
    faculty: '',
    class_name: '',
    year: '',
    role: 'student',
    avatar: 'https://github.com/shadcn.png'
  }

  const [profile, setProfile] = useState<any>(initialProfile)
  const [tab, setTab] = useState<string>('posts')
  const [following, setFollowing] = useState(!isMe)
  const [isFetching, setIsFetching] = useState(false)

  // Hàm Helper lấy token an toàn từ cả localStorage và sessionStorage
  const getToken = () => localStorage.getItem('access_token') || localStorage.getItem('token') || sessionStorage.getItem('access_token') || sessionStorage.getItem('token')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken()
        if (!token) return

        const response = await axios.get('http://127.0.0.1:8000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data.status) {
          const realData = response.data.data
          setProfile((prev: any) => ({
            ...prev,
            id: realData.id,
            name: realData.full_name || prev.name,
            email: realData.email || prev.email,
            phone_number: realData.phone_number || '',
            faculty: realData.faculty || '',
            class_name: realData.class_name || '',
            year: realData.academic_year || '',
            role: realData.role ? (realData.role.toLowerCase().includes('admin') ? 'admin' : realData.role.toLowerCase()) : prev.role,
            avatar: realData.avatar || prev.avatar,
          }))
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin profile:', error)
      }
    }

    if (isMe) {
      fetchProfile()
    }
  }, [isMe])

  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({
    full_name: '',
    phone_number: '',
    faculty: '',
    class_name: '',
    academic_year: '',
  })

  const handleOpenEdit = async () => {
    setIsFetching(true)
    try {
      const token = getToken()
      if (token) {
        const response = await axios.get('http://127.0.0.1:8000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data.status) {
          const realData = response.data.data
          setEditData({
            full_name: realData.full_name || '',
            phone_number: realData.phone_number || '',
            faculty: realData.faculty || '',
            class_name: realData.class_name || '',
            academic_year: realData.academic_year || '',
          })
          setShowEditModal(true)
          setIsFetching(false)
          return
        }
      } else {
        console.warn('Không tìm thấy token trong storage. Sử dụng dữ liệu mẫu.')
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thật từ server:', error)
    }

    // Fallback: Dùng dữ liệu hiện tại trên state nếu API gặp lỗi
    setEditData({
      full_name: profile.name || '',
      phone_number: profile.phone_number || '',
      faculty: profile.faculty || '',
      class_name: profile.class_name || '',
      academic_year: profile.year || '',
    })
    setShowEditModal(true)
    setIsFetching(false)
  }

  const handleSaveEdit = async () => {
    try {
      const token = getToken()
      
      const response = await axios.put('http://127.0.0.1:8000/api/user/profile', editData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('Cập nhật thành công:', response.data)
      
      // Cập nhật lại UI sau khi lưu thành công
      setProfile((prev: any) => ({
        ...prev,
        name: editData.full_name,
        phone_number: editData.phone_number,
        faculty: editData.faculty,
        class_name: editData.class_name,
        year: editData.academic_year,
      }))

      alert('Cập nhật hồ sơ thành công!')
      setShowEditModal(false)
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error)
      alert('Đã xảy ra lỗi khi cập nhật hồ sơ. Vui lòng kiểm tra lại!')
    }
  }

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
              <div className="d-flex gap-3 small mt-2">
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
                  onClick={handleOpenEdit}
                  disabled={isFetching}
                >
                  {isFetching ? <Spinner size="sm" /> : <SettingsIcon size={16} />} Chỉnh sửa hồ sơ
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
                  ['Khoa', profile.faculty || '—'],
                  ['Lớp', profile.class_name || '—'],
                  ['Khoá', profile.year || '—'],
                  ['Email', profile.email || '—'],
                  profile.phone_number ? ['Số điện thoại', profile.phone_number] : null,
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

        {/* Edit Profile Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">Chỉnh sửa hồ sơ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.full_name}
                  onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.phone_number}
                  onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                  placeholder="09xx xxx xxx"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Ngành học</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.faculty}
                  onChange={(e) => setEditData({ ...editData, faculty: e.target.value })}
                  placeholder="Công nghệ phần mềm..."
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Lớp học</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.class_name}
                  onChange={(e) => setEditData({ ...editData, class_name: e.target.value })}
                  placeholder="SE114.O21..."
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Năm học</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.academic_year}
                  onChange={(e) => setEditData({ ...editData, academic_year: e.target.value })}
                  placeholder="2022-2026"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Lưu thay đổi</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}
