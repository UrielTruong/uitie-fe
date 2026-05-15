import { useState, useRef } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { MessageCircle, Paperclip, Send, X, CornerDownRight } from 'lucide-react'
import UserAvatar from './UserAvatar'
import { authStore } from '#/lib/auth'
import { useStore } from '@tanstack/react-store'
import { useCreateComment } from '#/api/usePost'

interface Comment {
  id: number
  post_id: number
  parent_id: number | null
  content: string
  attachment_url?: string
  attachment_name?: string
  created_at: string
  user: {
    id: number
    full_name: string
  }
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: number
  comments: Comment[] // Nhận danh sách comment truyền từ bài viết xuống
}

export default function CommentSection({ postId, comments = [] }: CommentSectionProps) {
  const user = useStore(authStore, (s) => s.user)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // ── States cho chức năng Reply ──────────────────────────────────────────────
  const [replyingToId, setReplyingToId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [selectedReplyFile, setSelectedReplyFile] = useState<File | null>(null)

  // ── Hook gửi comment tái sử dụng hook của hệ thống ──────────────────────────
  const { mutate: sendComment, isPending: isCommenting } = useCreateComment()

  // Lọc ra các bình luận cấp cha (không có parent_id)
  const rootComments = comments.filter(c => !c.parent_id)

  // Hàm tìm các reply cho một comment cha (nếu API trả về mảng phẳng)
  const getRepliesForComment = (commentId: number) => {
    return comments.filter(c => c.parent_id === commentId)
  }

  const handleReplySubmit = (e: React.FormEvent, parentId: number) => {
    e.preventDefault()
    const trimmedReply = replyText.trim()
    if (!trimmedReply && !selectedReplyFile) return

    const formData = new FormData()
    formData.append('post_id', postId.toString())
    formData.append('content', trimmedReply)
    formData.append('parent_id', parentId.toString()) // Đánh dấu đây là Reply
    if (selectedReplyFile) {
      formData.append('attachment', selectedReplyFile)
    }

    sendComment(formData, {
      onSuccess: () => {
        setReplyText('')
        setSelectedReplyFile(null)
        setReplyingToId(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    })
  }

  const removeReplyFile = () => {
    setSelectedReplyFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="mt-3 pt-3 border-top">
      <div className="d-flex align-items-center gap-2 mb-3 text-secondary">
        <MessageCircle size={16} />
        <span className="small fw-bold">Bình luận ({comments.length})</span>
      </div>

      <div className="d-flex flex-column gap-3 max-vh-50 overflow-y-auto pe-1">
        {rootComments.map((comment) => {
          const childReplies = getRepliesForComment(comment.id)
          const isReplyingThis = replyingToId === comment.id

          return (
            <div key={comment.id} className="d-flex flex-column gap-2">
              {/* ── Bình luận gốc (Parent) ────────────────────────────────────── */}
              <div className="d-flex gap-2 align-items-start">
                <UserAvatar fullName={comment.user.full_name} size={28} />
                <div className="flex-grow-1">
                  <div className="bg-light p-2 rounded-4 d-inline-block px-3" style={{ maxWidth: '100%' }}>
                    <span className="fw-bold small d-block">{comment.user.full_name}</span>
                    <span className="small" style={{ whiteSpace: 'pre-line' }}>{comment.content}</span>
                    
                    {/* File đính kèm của bình luận nếu có */}
                    {comment.attachment_url && (
                      <div className="mt-1 d-block">
                        <a 
                          href={comment.attachment_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-primary small text-decoration-underline text-truncate d-inline-block"
                          style={{ maxWidth: '200px' }}
                        >
                          📎 {comment.attachment_name || 'Xem tệp đính kèm'}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Nút Phản hồi */}
                  <div className="ps-2 mt-1">
                    <Button 
                      variant="link" 
                      className="p-0 text-muted small text-decoration-none fw-bold"
                      style={{ fontSize: '11px' }}
                      onClick={() => {
                        setReplyingToId(isReplyingThis ? null : comment.id)
                        setReplyText('')
                        setSelectedReplyFile(null)
                      }}
                    >
                      {isReplyingThis ? 'Hủy' : 'Phản hồi'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* ── Danh sách các phản hồi (Replies) ──────────────────────────── */}
              {childReplies.length > 0 && (
                <div className="ms-4 d-flex flex-column gap-2 border-start ps-3 position-relative">
                  {childReplies.map((reply) => (
                    <div key={reply.id} className="d-flex gap-2 align-items-start position-relative">
                      <CornerDownRight size={14} className="text-muted position-absolute start-0 top-0 translate-middle-x mt-1 ms-n3" />
                      <UserAvatar fullName={reply.user.full_name} size={24} />
                      <div className="bg-light p-2 rounded-4 d-inline-block px-3" style={{ maxWidth: '100%' }}>
                        <span className="fw-bold small d-block">{reply.user.full_name}</span>
                        <span className="small" style={{ whiteSpace: 'pre-line' }}>{reply.content}</span>
                        
                        {reply.attachment_url && (
                          <div className="mt-1 d-block">
                            <a 
                              href={reply.attachment_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-primary small text-decoration-underline text-truncate d-inline-block"
                              style={{ maxWidth: '180px' }}
                            >
                              📎 {reply.attachment_name || 'Xem tệp'}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Form Nhập câu trả lời (Reply Input Form) ───────────────────── */}
              {isReplyingThis && (
                <Form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="ms-4 ps-3 mt-1">
                  <div className="d-flex gap-2 align-items-start">
                    <UserAvatar fullName={user?.full_name ?? ''} size={24} />
                    <div className="flex-grow-1 position-relative">
                      <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder={`Trả lời bài viết của ${comment.user.full_name}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="rounded-4 border-0 bg-light pe-5 small shadow-none"
                        style={{ resize: 'none', minHeight: '34px', fontSize: '13px' }}
                      />
                      <div className="position-absolute end-0 top-0 h-100 d-flex align-items-center pe-2 gap-1">
                        <input
                          type="file"
                          hidden
                          ref={fileInputRef}
                          onChange={(e) => setSelectedReplyFile(e.target.files?.[0] || null)}
                          accept="image/*,video/*,.pdf"
                        />
                        <Button 
                          variant="link" 
                          className="p-1 text-secondary" 
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip size={14} />
                        </Button>
                        <Button 
                          type="submit"
                          variant="link" 
                          className="p-1 text-primary" 
                          disabled={isCommenting || (!replyText.trim() && !selectedReplyFile)}
                        >
                          {isCommenting ? <Spinner animation="border" size="sm" style={{ width: '12px', height: '12px' }} /> : <Send size={14} />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview file đính kèm của reply */}
                  {selectedReplyFile && (
                    <div className="ms-4 mt-1 d-inline-flex align-items-center gap-2 bg-light p-1 rounded-3 border" style={{ fontSize: '11px' }}>
                      <span className="text-truncate" style={{ maxWidth: '150px' }}>
                        {selectedReplyFile.name}
                      </span>
                      <X size={12} className="text-danger cursor-pointer" onClick={removeReplyFile} />
                    </div>
                  )}
                </Form>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}