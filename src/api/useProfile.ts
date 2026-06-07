import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosClient from '#/api/axiosClient' 

// Hook lấy thông tin Profile
export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId || 'me'],
    queryFn: async () => {
      // /user/profile (self) returns raw user; /user/{id} returns { status, data: user }
      const url = userId ? `/user/${userId}` : '/user/profile'
      const response = await axiosClient.get(url)
      const raw = response.data
      return raw?.data ?? raw
    },
  })
}

// Hook cập nhật thông tin Profile
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosClient.put('/user/profile', payload)
      return response.data
    },
    onSuccess: () => {
      // Khi cập nhật thành công, xóa cache để useQuery tự động fetch lại data mới
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

// Hook lấy danh sách bài viết của user
export function useUserPosts(userId?: string | number) {
  return useQuery({
    queryKey: ['user-posts', userId],
    queryFn: async () => {
      if (!userId) return []
      const response = await axiosClient.get(`/users/${userId}/posts`)
      return response.data.data
    },
    enabled: !!userId,
  })
}
