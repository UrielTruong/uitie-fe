import type { Post } from '#/types/post'
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import UserAvatar from './UserAvatar'

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

  function toggleLike() {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }
  console.log(post)

  return (
    <Card className="mb-4 shadow-sm border-0 rounded-4">
      <Card.Body className="p-4">
        {/* Author */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
            <UserAvatar fullName={post.author.full_name} />
            <div>
              <h6 className="mb-0 fw-bold">{post.author.full_name}</h6>
              <div className="text-muted small">{timeAgo(post.created_at)}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card.Text className="mb-4" style={{ whiteSpace: 'pre-line' }}>
          {post.content}
        </Card.Text>

        {/* Actions */}
        <div className="d-flex align-items-center gap-2 pt-3 border-top">
          {/* Like */}
          <Button
            variant="link"
            className={`d-flex align-items-center gap-2 text-decoration-none p-2 rounded-3 ${liked ? 'text-danger bg-danger bg-opacity-10' : 'text-secondary hover-bg-danger-subtle'}`}
            // onClick={toggleLike}
          >
            <Heart
              size={18}
              className={liked ? 'fill-danger text-danger' : ''}
            />
            <span className="small fw-medium">{likeCount}</span>
          </Button>

          {/* Comment */}
          <Button
            variant="link"
            className="d-flex align-items-center gap-2 text-decoration-none p-2 rounded-3 text-secondary"
          >
            <MessageCircle size={18} />
            <span className="small fw-medium">{post.comments}</span>
          </Button>

          {/* Share */}
          <Button
            variant="link"
            className="d-flex align-items-center gap-2 text-decoration-none p-2 rounded-3 text-secondary"
          >
            <Share2 size={18} />
            <span className="small fw-medium">{post.shares}</span>
          </Button>

          {/* Bookmark */}
          <Button
            variant="link"
            onClick={() => setBookmarked((p) => !p)}
            className={`ms-auto d-flex align-items-center text-decoration-none p-2 rounded-3 ${bookmarked ? 'text-warning bg-warning bg-opacity-10' : 'text-secondary hover-bg-warning-subtle'}`}
          >
            <Bookmark
              size={18}
              className={bookmarked ? 'fill-warning text-warning' : ''}
            />
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
