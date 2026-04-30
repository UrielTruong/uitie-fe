import axiosClient from '#/api/axiosClient'
import type { Response } from '#/types/response'
import type { User } from '#/types/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'


export function useGetUserList() {
  return useQuery({
    queryKey: ['user-list'],
    queryFn: () => axiosClient.get<Response<User[]>>('/admin/users'),
  })
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (payload: User) => axiosClient.post<Response<User>>('/admin/users', payload),
    onSuccess: (data) => {
      toast.success('User created successfully')
    },
    onError: (error) => {
      toast.error('Failed to create user')
    },
  })
}