import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, deletePost, fetchFeed, searchPost, updatePost } from './postApi'
import type { CreatePostPayload, UpdatePostPayload } from '#/types/post'

export const useFeedPosts = () => {
  return useQuery({
    queryKey: ['post', 'feed'],
    queryFn: fetchFeed,
  })
}

export const useSearchPost = (keyword?: string) => {
  return useQuery({
    queryKey: ['post', 'search', keyword],
    queryFn: () => searchPost(keyword),
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'feed'] })
    },
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePostPayload }) =>
      updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'feed'] })
      queryClient.invalidateQueries({ queryKey: ['post', 'search'] })
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'feed'] })
      queryClient.invalidateQueries({ queryKey: ['post', 'search'] })
    },
  })
}