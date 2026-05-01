import axiosClient from '#/api/axiosClient'
import type { Response } from '#/types/response'
import type { CreateUserRequest, UpdateUserRequest, User } from '#/types/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'


const mockData = {
  data: {
    users: [
        {
          id: '1',
          email: 'admin@example.com',
          full_name: 'Admin',
          role: 'ADMIN',
          status: 'Active',
        },
        {
          id: '2',
          email: 'user@example.com',
          full_name: 'User',
          role: 'STUDENT',
          status: 'Active',
        },
        {
          id: '3',
          email: 'superadmin@example.com',
          full_name: 'Super Admin',
          role: 'SUPER_ADMIN',
          status: 'Active',
        },
        {
          id: '4',
          email: 'student@example.com',
          full_name: 'Student',
          role: 'STUDENT',
          status: 'Active',
        },
        {
          id: '5',
          email: 'student@example.com',
          full_name: 'Student',
          role: 'STUDENT',
          status: 'Active',
        },
    ],
  },
}
export function useGetUserList() {
  return useQuery({
    queryKey: ['user-list'],
    // queryFn: () => axiosClient.get<Response<User[]>>('/admin/users'),

    queryFn: () => ({ data: mockData }),
  })
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => axiosClient.post<Response<undefined>>('/admin/users', payload),
    onSuccess: (data) => {
      toast.success('User created successfully')
      // queryClient.invalidateQueries({ queryKey: ['user-list'] })
    },
  })
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: (payload: UpdateUserRequest) => axiosClient.put<Response<undefined>>(`/admin/users/${payload.id}`, payload),
    onSuccess: (data) => {
      toast.success('User updated successfully')
      // queryClient.invalidateQueries({ queryKey: ['user-list'] })
    },
  })
}

//delete user
export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: string) => axiosClient.delete<Response<undefined>>(`/admin/users/${id}`),
    onSuccess: (data) => {
      toast.success('User deleted successfully')
      // queryClient.invalidateQueries({ queryKey: ['user-list'] })
    },
  })
}

//export users pdf
export async function exportUsersPdf(): Promise<void> {
  const response = await axiosClient.get('/admin/user/export-pdf', {
    responseType: 'blob',
  })

  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'users.pdf'
  link.click()
  URL.revokeObjectURL(url)
}