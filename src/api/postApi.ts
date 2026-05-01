import axiosClient from './axiosClient'
import type { CreatePostPayload, Post } from '../types/post'

interface CreatePostResponse {
  status: boolean
  message: string
  data: Post
}

export const fetchFeed = async (): Promise<Post[]> => {
    const res = await axiosClient.get('/post')
    return res.data.data
  }

export const createPost = (payload: CreatePostPayload) =>
  axiosClient
    .post<CreatePostResponse>('/post', payload)
    .then((res) => res.data)