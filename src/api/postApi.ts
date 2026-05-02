import type { Pagination } from '#/types/response'
import type { CreatePostPayload, Post, UpdatePostPayload } from '../types/post'
import axiosClient from './axiosClient'

interface CreatePostResponse {
  status: boolean
  message: string
  data: Post
}
interface UpdatePostResponse {
  status: boolean
  message: string
  data: Post
}

interface DeletePostResponse {
  status: boolean
  message: string
}
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