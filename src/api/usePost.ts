import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, fetchFeed, searchPost } from './postApi'
import type { CreatePostPayload } from '#/types/post'

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