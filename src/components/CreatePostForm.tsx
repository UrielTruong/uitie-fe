import { useState } from 'react'
import { Button, Card, Dropdown, Form } from 'react-bootstrap'
import {
  Globe,
  Lock,
  BookOpen,
  ClipboardList,
  Briefcase,
  Coffee,
  Tag,
} from 'lucide-react'
import { useCreatePost } from '../api/usePost'
import type { CreatePostPayload } from '../types/post'
import { CATEGORIES } from '#/types/category'
import toast from 'react-hot-toast'

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

export default function CreatePostForm() {
  const [content, setContent] = useState('')
  const [focused, setFocused] = useState(false)
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const { mutate, isPending } = useCreatePost()

  const isExpanded = focused || content.length > 0

  const selectedVisibility = VISIBILITY_OPTIONS.find(
    (o) => o.value === visibility,
  )!
  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId)
  const CategoryIcon =
    categoryId !== '' ? CATEGORY_ICONS[categoryId as number] : Tag

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (categoryId === '') {
      toast.error('Vui lòng chọn danh mục bài viết!')
      return
    }

    const payload: CreatePostPayload = {
      content: content.trim() || undefined,
      visibility,
      category_id: categoryId,
    }

    mutate(payload, {
      onSuccess: (res) => {
        if (res.status) {
          setContent('')
          setVisibility('Public')
          setCategoryId('')
          toast.success('Đăng bài thành công vui lòng chờ admin duyệt.')
        }
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ??
          'Đăng bài thất bại vui lòng thử lại sau.'
        toast.error(message)
      },
    })
  }

  return (
    <Card
      className="mb-4 rounded-4"
      style={{
        border: '1.5px solid rgba(13,110,253,0.20)',
        boxShadow: '0 4px 24px rgba(13,110,253,0.15)',
      }}
    >
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Bạn đang nghĩ gì?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="border-0 bg-light rounded-3 mb-3 p-3"
            style={{
              resize: 'none',
              minHeight: isExpanded ? '80px' : '40px',
              transition: 'min-height 0.2s ease',
              overflow: isExpanded ? 'auto' : 'hidden',
            }}
          />

          <div className="d-flex align-items-center gap-2 pt-2 border-top">
            {/* Visibility dropdown */}
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                size="sm"
                className="d-flex align-items-center gap-1 rounded-3 border text-secondary px-2 py-1"
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

            {/* Category dropdown */}
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                size="sm"
                className={`d-flex align-items-center gap-1 rounded-3 border px-2 py-1 ${categoryId === '' ? 'text-muted' : 'text-secondary'}`}
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

            <div className="flex-grow-1" />

            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="rounded-3 px-3"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  />
                  Đang đăng...
                </>
              ) : (
                'Đăng bài'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}
