import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import type { Comment } from '#/types/comment'
import { useCreateComment, useDeleteComment } from '#/api/useComment'
import UserAvatar from './UserAvatar'
import { useStore } from '@tanstack/react-store'
import { authStore } from '#/lib/auth'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  comment: Comment & { replies?: Comment[] }
  postId: number
  onCountChange?: (delta: number) => void
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  return `${Math.floor(h / 24)} ngày trước`
}

export default function CommentItem({ comment, postId, onCountChange }: Props) {
  const user = useStore(authStore, (s) => s.user)
  const { mutate: createReply, isPending: isReplying } = useCreateComment()
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment()
  const [isReplyingOpen, setIsReplyingOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const currentUserId = Number(user?.id)
  const isOwner = currentUserId === Number(comment.user.id)
  const isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin'
  const canDelete = isOwner || isAdmin

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    createReply(
      { post_id: postId, content: replyContent.trim(), parent_comment_id: comment.id },
      {
        onSuccess: () => {
          setReplyContent('')
          setIsReplyingOpen(false)
          onCountChange?.(1)
        },
      }
    )
  }

  const handleDelete = () => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return
    deleteComment(
      { id: comment.id, post_id: postId },
      {
        onSuccess: () => {
          toast.success('Đã xóa bình luận')
          onCountChange?.(-1)
        },
        onError: () => toast.error('Xóa bình luận thất bại'),
      }
    )
  }

  return (
    <div className="d-flex gap-2 w-100">
      <UserAvatar fullName={comment.user.full_name} />
      <div className="flex-grow-1">
        <div className="bg-light rounded-4 px-3 py-2">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-bold small">{comment.user.full_name}</span>
            {canDelete && (
              <button
                type="button"
                className="btn btn-link p-0 text-muted hover-text-danger border-0 text-decoration-none"
                onClick={handleDelete}
                disabled={isDeleting}
                title="Xóa bình luận"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="small text-break" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
            {comment.content}
          </div>
        </div>
        <div className="d-flex gap-3 align-items-center mt-1 ms-2 mb-2">
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            {timeAgo(comment.created_at)}
          </span>
          <button
            type="button"
            className="btn btn-link p-0 text-muted fw-medium text-decoration-none border-0"
            style={{ fontSize: '0.75rem' }}
            onClick={() => setIsReplyingOpen(!isReplyingOpen)}
          >
            Phản hồi
          </button>
        </div>

        {isReplyingOpen && (
          <Form onSubmit={handleReplySubmit} className="d-flex gap-2 align-items-start mt-2 mb-3">
            <UserAvatar fullName={user?.full_name ?? '?'} />
            <div className="flex-grow-1">
              <Form.Control
                as="textarea"
                rows={1}
                placeholder={`Phản hồi ${comment.user.full_name}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="rounded-3 bg-light border-0 py-2 px-3 small"
                style={{ resize: 'none', fontSize: '0.875rem' }}
                autoFocus
              />
              <div className="d-flex justify-content-end gap-2 mt-2">
                <Button variant="light" size="sm" className="rounded-pill px-3 py-1 fw-medium" style={{ fontSize: '0.8rem' }} onClick={() => setIsReplyingOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm" className="rounded-pill px-3 py-1 fw-medium" style={{ fontSize: '0.8rem' }} disabled={isReplying || !replyContent.trim()}>
                  {isReplying ? 'Đang gửi...' : 'Gửi'}
                </Button>
              </div>
            </div>
          </Form>
        )}

        {/* Đệ quy gọi chính nó để render comment lồng nhau */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="d-flex flex-column gap-3 mt-3 ms-4 ps-3 border-start border-2" style={{ borderColor: 'rgba(108, 117, 125, 0.25)' }}>
            {comment.replies.map((reply) => (
              <CommentItem 
                key={reply.id} 
                comment={reply as any} 
                postId={postId} 
                onCountChange={onCountChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}