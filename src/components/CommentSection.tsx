import React, { useState, useMemo } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useGetComments, useCreateComment } from '#/api/useComment'
import CommentItem from './CommentItem'
import type { Comment } from '#/types/comment'
import UserAvatar from './UserAvatar'
import { useStore } from '@tanstack/react-store'
import { authStore } from '#/lib/auth'

interface Props {
  postId: number
  onCountChange?: (delta: number) => void
}

export default function CommentSection({ postId, onCountChange }: Props) {
  const { data: comments = [], isLoading } = useGetComments(postId)
  const { mutate: createComment, isPending } = useCreateComment()
  const user = useStore(authStore, (s) => s.user)
  const [content, setContent] = useState('')

  // Group mảng comment phẳng (flat array) thành một mảng cây nhiều cấp
  const rootComments = useMemo(() => {
    const map = new Map<string, Comment & { replies: Comment[] }>()
    comments.forEach((c) => {
      // Đảm bảo đưa key về chuỗi (String) đề phòng ID kiểu BigInt trả về lúc là số, lúc là chuỗi
      map.set(String(c.id), { ...c, replies: [] })
    })

    const roots: (Comment & { replies: Comment[] })[] = []
    map.forEach((c) => {
      // Bắt mọi trường hợp property (kể cả camelCase do interceptor FE chuyển đổi)
      const rawParentId = c.parent_comment_id ?? (c as any).parent_id ?? (c as any).parentCommentId
      
      // Chặn các giá trị rác kiểu 'null', '0', 'undefined' (nếu có)
      if (rawParentId && String(rawParentId) !== 'null' && String(rawParentId) !== '0') {
        const parent = map.get(String(rawParentId))
        if (parent) {
          parent.replies.push(c)
        } else {
          // FALLBACK: Tránh rủi ro bị mất comment nếu reply một ID đã bị xoá
          roots.push(c)
        }
      } else {
        roots.push(c)
      }
    })
    return roots
  }, [comments])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    createComment(
      { post_id: postId, content: content.trim() },
      { onSuccess: () => {
          setContent('')
          onCountChange?.(1)
      }}
    )
  }

  return (
    <div className="pt-3 mt-3 border-top">
      {isLoading ? (
        <div className="text-center py-3 small text-muted">Đang tải bình luận...</div>
      ) : (
        <div className="d-flex flex-column gap-3 mb-4">
          {rootComments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              postId={postId} 
              onCountChange={onCountChange}
            />
          ))}
        </div>
      )}

      <Form onSubmit={handleSubmit} className="d-flex gap-2 align-items-start">
        <UserAvatar fullName={user?.full_name ?? '?'} />
        <div className="flex-grow-1">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Viết bình luận..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded-3 bg-light border-0 py-2 px-3 small"
            style={{ resize: 'none', fontSize: '0.875rem' }}
          />
          {content.trim() && (
            <div className="d-flex justify-content-end mt-2">
              <Button type="submit" size="sm" variant="primary" disabled={isPending} className="rounded-pill px-3 py-1 fw-medium" style={{ fontSize: '0.8rem' }}>
                {isPending ? 'Đang gửi...' : 'Gửi'}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </div>
  )
}