import { createFileRoute } from '@tanstack/react-router'
import { type FeedPost } from '#/lib/fake-api'
import FeedPostCard from '#/components/FeedPostCard'
import Spinner from 'react-bootstrap/Spinner'
import CreatePostForm from '#/components/CreatePostForm'
import { useFeedPosts } from '#/api/usePost'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: posts, isLoading } = useFeedPosts()

  return (
    <div className="container py-4 px-3" style={{ maxWidth: '600px' }}>
      <h4 className="fw-bold mb-4">Bảng tin của bạn</h4>
      <CreatePostForm />
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="d-flex flex-column">
          {posts?.map((post) => (
            <FeedPostCard key={post.id} post={post as unknown as FeedPost} /> // ← bỏ as unknown as FeedPost
          ))}
        </div>
      )}
    </div>
  )
}
