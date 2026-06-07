import { useMutation, useQueryClient } from '@tanstack/react-query'
import { followUser, unfollowUser } from './followApi'
import toast from 'react-hot-toast'

export const useFollowUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['suggestedFollows'] })
      queryClient.invalidateQueries({ queryKey: ['post', 'feed', 'following'] })
    },
    onError: () => toast.error('Theo dõi thất bại. Vui lòng thử lại.'),
  })
}

export const useUnfollowUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => unfollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['suggestedFollows'] })
      queryClient.invalidateQueries({ queryKey: ['post', 'feed', 'following'] })
    },
    onError: () => toast.error('Bỏ theo dõi thất bại. Vui lòng thử lại.'),
  })
}
