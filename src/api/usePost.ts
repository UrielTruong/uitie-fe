import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  createPost, 
  deletePost, 
  fetchFeed, 
  searchPost, 
  updatePost, 
  likePost, 
  sharePost, 
  createComment 
} from './postApi'
import type { CreatePostPayload, UpdatePostPayload } from '#/types/post'
import { toast } from 'react-hot-toast'

// --- Hook lấy danh sách bài viết ---
export const useFeedPosts = () => {
  return useQuery({
    queryKey: ['post', 'feed'],
    queryFn: fetchFeed,
  })
}

// --- Hook tìm kiếm bài viết ---
export const useSearchPost = (keyword?: string) => {
  return useQuery({
    queryKey: ['post', 'search', keyword],
    queryFn: () => searchPost(keyword),
    enabled: !!keyword, // Chỉ chạy khi có từ khóa
  })
}

// --- Hook tạo bài viết ---
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'feed'] })
      toast.success('Đã đăng bài viết mới!')
    },
    onError: () => toast.error('Đăng bài thất bại.'),
  })
}

// --- Hook cập nhật bài viết ---
export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePostPayload }) =>
      updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'feed'] })
      queryClient.invalidateQueries({ queryKey: ['post', 'search'] })
      toast.success('Cập nhật bài viết thành công!')
    },
  })
}

// --- Hook xóa bài viết ---
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'feed'] })
      queryClient.invalidateQueries({ queryKey: ['post', 'search'] })
      toast.success('Đã xóa bài viết.')
    },
  })
}

// --- Hook tương tác bài viết (Mới cập nhật) ---

/**
 * Hook xử lý Like/Unlike
 */
export const useLikePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => likePost(id),
    onSuccess: () => {
      // Invalidate để cập nhật số lượng like và trạng thái đã like
      queryClient.invalidateQueries({ queryKey: ['post', 'feed'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Lỗi khi tương tác bài viết.')
    }
  })
}

/**
 * Hook xử lý chia sẻ bài viết
 */
export const useSharePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => sharePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'feed'] })
      toast.success('Đã chia sẻ bài viết lên tường của bạn!')
    },
  })
}

/**
 * Hook xử lý bình luận (Hỗ trợ text, file đính kèm và reply)
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => createComment(formData),
    onSuccess: () => {
      // Refresh feed để hiển thị bình luận mới ngay lập tức
      queryClient.invalidateQueries({ queryKey: ['post', 'feed'] })
      toast.success('Đã gửi bình luận!')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể gửi bình luận.')
    }
  })
}