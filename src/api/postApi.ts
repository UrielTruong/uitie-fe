import type { Pagination } from '#/types/response'
import type { CreatePostPayload, Post, UpdatePostPayload } from '../types/post'
import axiosClient from './axiosClient'

// --- Interface phản hồi cơ bản ---
interface BaseResponse<T> {
  status: boolean
  message: string
  data: T
}

type CreatePostResponse = BaseResponse<Post>
type UpdatePostResponse = BaseResponse<Post>
type DeletePostResponse = Omit<BaseResponse<any>, 'data'>

// --- Post API ---

export const fetchFeed = async (): Promise<Post[]> => {
  const res = await axiosClient.get('/post')
  return res.data.data
}

export const createPost = (payload: CreatePostPayload) =>
  axiosClient
    .post<CreatePostResponse>('/post', payload)
    .then((res) => res.data)

export const searchPost = async (keyword?: string): Promise<Pagination<Post[]>> => {
  const res = await axiosClient.get<Pagination<Post[]>>('/post/search', { params: { keyword } })
  return res.data
}

export const updatePost = (id: number, payload: UpdatePostPayload) =>
  axiosClient
    .put<UpdatePostResponse>(`/post/${id}`, payload)
    .then((res) => res.data)

export const deletePost = (id: number) =>
  axiosClient
    .delete<DeletePostResponse>(`/post/${id}`)
    .then((res) => res.data)

// --- Tương tác bài viết (Thêm mới) ---

/**
 * Like hoặc Unlike bài viết
 */
export const likePost = (id: number) =>
  axiosClient
    .post<BaseResponse<any>>(`/post/${id}/like`)
    .then((res) => res.data)

/**
 * Chia sẻ bài viết
 */
export const sharePost = (id: number) =>
  axiosClient
    .post<BaseResponse<any>>(`/post/${id}/share`)
    .then((res) => res.data)

/**
 * Bình luận bài viết (Hỗ trợ file đính kèm và Reply)
 * Dùng FormData để truyền dữ liệu đa phương thức
 */
export const createComment = (formData: FormData) =>
  axiosClient
    .post<BaseResponse<any>>('/comment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)

// Gom nhóm lại để dễ sử dụng nếu cần
export const postApi = {
  fetchFeed,
  createPost,
  searchPost,
  updatePost,
  deletePost,
  likePost,
  sharePost,
  createComment,
}