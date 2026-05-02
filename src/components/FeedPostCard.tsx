import type { Post } from '#/types/post'
import {
  Bookmark,
  BookOpen,
  Briefcase,
  ClipboardList,
  Coffee,
  EllipsisVertical,
  Globe,
  Heart,
  Lock,
  MessageCircle,
  Pencil,
  Share2,
  Tag,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Card, Dropdown, Form, Modal } from 'react-bootstrap'
import UserAvatar from './UserAvatar'
import { authStore } from '#/lib/auth'
import { useDeletePost, useUpdatePost } from '#/api/usePost'
import { useStore } from '@tanstack/react-store'
import toast from 'react-hot-toast'
import { CATEGORIES } from '#/types/category'

// ── constants (mirror CreatePostForm) ────────────────────────────────────────
const VISIBILITY_OPTIONS = [
  { value: 'Public' as const, label: 'Công khai', Icon: Globe },
  { value: 'Private' as const, label: 'Chỉ mình tôi', Icon: Lock },
]

const CATEGORY_ICONS: Record<number, React.ElementType> = {
  1: BookOpen,
  2: ClipboardList,
  3: Briefcase,
  4: Coffee,
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

interface FeedPostCardProps {
  post: Post
}

export default function FeedPostCard({ post }: FeedPostCardProps) {
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [bookmarked, setBookmarked] = useState(false)

  const user = useStore(authStore, (s) => s.user)
  const { mutate: mutateUpdatePost, isPending: isUpdating } = useUpdatePost()
  const { mutate: mutateDeletePost, isPending: isDeleting } = useDeletePost()

  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // ── edit form state ─────────────────────────────────────────────────────────
  const [editContent, setEditContent] = useState('')
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public')
  const [categoryId, setCategoryId] = useState<number | ''>('')

  // Seed from post when modal opens — this is the critical fix
  useEffect(() => {
    if (showEditModal) {
      setEditContent(post.content ?? '')
      setVisibility((post.visibility as 'Public' | 'Private') ?? 'Public')
      setCategoryId(post.category?.id ?? '')
    }
  }, [showEditModal])

  // ── derived values (same pattern as CreatePostForm) ─────────────────────────
  const selectedVisibility = VISIBILITY_OPTIONS.find(
    (o) => o.value === visibility,
  )!
  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId)
  const CategoryIcon =
    categoryId !== '' ? CATEGORY_ICONS[categoryId as number] : Tag

  // ── guards ───────────────────────────────────────────────────────────────────
  const currentUserId = Number(user?.id)
  const postAuthorId = Number(post.author.id)
  const isOwner =
    Number.isFinite(currentUserId) && currentUserId === postAuthorId
  const isAccepted = post.status.toLowerCase() === 'accepted'
  const canManagePost = isOwner && isAccepted

  function toggleLike() {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  function handleEditSubmit() {
    const trimmed = editContent.trim()

    // ── validation (mirrors CreatePostForm) ──────────────────────────────────
    if (!trimmed) {
      toast.error('Nội dung bài viết không được để trống.')
      return
    }
    if (categoryId === '') {
      toast.error('Vui lòng chọn danh mục bài viết!')
      return
    }

    mutateUpdatePost(
      {
        id: post.id,
        payload: {
          content: trimmed,
          visibility,
          category_id: categoryId as number,
        },
      },
      {
        onSuccess: (res) => {
          if (res.status) {
            toast.success('Cập nhật bài viết thành công.')
            setShowEditModal(false)
          } else {
            toast.error(res.message || 'Cập nhật bài viết thất bại.')
          }
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? 'Cập nhật bài viết thất bại.',
          )
        },
      },
    )
  }

  function handleDeleteConfirm() {
    mutateDeletePost(post.id, {
      onSuccess: (res) => {
        if (res.status) {
          toast.success('Xoá bài viết thành công.')
          setShowDeleteModal(false)
        } else {
          toast.error(res.message || 'Xoá bài viết thất bại.')
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message ?? 'Xoá bài viết thất bại.')
      },
    })
  }

  return (
    <Card className="mb-4 shadow-sm border-0 rounded-4">
      <Card.Body className="p-4">
        {/* Author */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
            <UserAvatar fullName={post.author.full_name} />
            <div>
              <div>
                <h6 className="mb-0 fw-bold">{post.author.full_name}</h6>
                <div className="d-flex align-items-center gap-1 text-muted small">
                  {post.visibility === 'Private' ? (
                    <Lock size={11} />
                  ) : (
                    <Globe size={11} />
                  )}
                  <span>{timeAgo(post.updated_at)}</span>
                  {post.is_edited && <span>· edited</span>}
                </div>
              </div>
            </div>
          </div>

          {canManagePost && (
            <Dropdown align="end">
              <Dropdown.Toggle
                as={Button}
                variant="link"
                className="text-secondary p-1 border-0 shadow-none"
                id={`post-action-${post.id}`}
                bsPrefix="btn"
              >
                <EllipsisVertical size={18} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  className="d-flex align-items-center gap-2"
                  onClick={() => setShowEditModal(true)}
                >
                  <Pencil size={14} />
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  className="d-flex align-items-center gap-2 text-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={14} />
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        {/* Category tag */}
        {post.category && (
          <div className="mb-2">
            {(() => {
              const Icon = CATEGORY_ICONS[post.category.id] ?? Tag
              return (
                <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary fw-normal px-2 py-1 d-inline-flex align-items-center gap-1">
                  <Icon size={12} />
                  <span className="small">{post.category.category_name}</span>
                </span>
              )
            })()}
          </div>
        )}
        {/* Content */}
        <Card.Text className="mb-4" style={{ whiteSpace: 'pre-line' }}>
          {post.content}
        </Card.Text>

        {/* Actions */}
        <div className="d-flex align-items-center gap-2 pt-3 border-top">
          <Button
            variant="link"
            className={`d-flex align-items-center gap-2 text-decoration-none p-2 rounded-3 ${
              liked ? 'text-danger bg-danger bg-opacity-10' : 'text-secondary'
            }`}
          >
            <Heart
              size={18}
              className={liked ? 'fill-danger text-danger' : ''}
            />
            <span className="small fw-medium">{likeCount}</span>
          </Button>

          <Button
            variant="link"
            className="d-flex align-items-center gap-2 text-decoration-none p-2 rounded-3 text-secondary"
          >
            <MessageCircle size={18} />
            <span className="small fw-medium">{post.comments}</span>
          </Button>

          <Button
            variant="link"
            className="d-flex align-items-center gap-2 text-decoration-none p-2 rounded-3 text-secondary"
          >
            <Share2 size={18} />
            <span className="small fw-medium">{post.shares}</span>
          </Button>

          <Button
            variant="link"
            onClick={() => setBookmarked((p) => !p)}
            className={`ms-auto d-flex align-items-center text-decoration-none p-2 rounded-3 ${
              bookmarked
                ? 'text-warning bg-warning bg-opacity-10'
                : 'text-secondary'
            }`}
          >
            <Bookmark
              size={18}
              className={bookmarked ? 'fill-warning text-warning' : ''}
            />
          </Button>
        </div>
      </Card.Body>

      {/* ── Edit modal ────────────────────────────────────────────────────────── */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={5}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="border-0 bg-light rounded-3 p-3"
            style={{ resize: 'none' }}
          />

          <div className="d-flex align-items-center gap-2 pt-2 border-top mt-3">
            {/* Visibility */}
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                size="sm"
                className="d-flex align-items-center gap-1 rounded-3 border text-secondary px-2 py-1"
                bsPrefix="btn"
              >
                <selectedVisibility.Icon size={14} />
                <span className="small">{selectedVisibility.label}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {VISIBILITY_OPTIONS.map(({ value, label, Icon }) => (
                  <Dropdown.Item
                    key={value}
                    onClick={() => setVisibility(value)}
                    active={visibility === value}
                    className="d-flex align-items-center gap-2"
                  >
                    <Icon size={14} />
                    {label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Category */}
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                size="sm"
                className={`d-flex align-items-center gap-1 rounded-3 border px-2 py-1 ${
                  categoryId === '' ? 'text-muted' : 'text-secondary'
                }`}
                bsPrefix="btn"
              >
                <CategoryIcon size={14} />
                <span className="small">
                  {selectedCategory
                    ? selectedCategory.category_name
                    : 'Chọn danh mục'}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {CATEGORIES.map((category) => {
                  const Icon = CATEGORY_ICONS[category.id]
                  return (
                    <Dropdown.Item
                      key={category.id}
                      onClick={() => setCategoryId(category.id)}
                      active={categoryId === category.id}
                      className="d-flex align-items-center gap-2"
                    >
                      <Icon size={14} />
                      {category.category_name}
                    </Dropdown.Item>
                  )
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditModal(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Delete modal ──────────────────────────────────────────────────────── */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete post</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  )
}
