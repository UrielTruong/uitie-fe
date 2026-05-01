import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, fetchFeed } from './postApi'
import type { CreatePostPayload } from '#/types/post'

export const useFeedPosts = () => {
  return useQuery({
    queryKey: ['posts', 'feed'],
    queryFn: fetchFeed,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] })
    },
  })
}