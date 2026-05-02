import axiosClient from '#/api/axiosClient'
import type { Post, ValidatePostRequest } from '#/types/post'
import type { Response } from '#/types/response'
import type { Statistics } from '#/types/statistic'
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

//export posts pdf
export async function exportPostsPdf(): Promise<void> {
  const response = await axiosClient.get('/admin/post/export-pdf', {
    responseType: 'blob',
  })

  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'posts.pdf'
  link.click()
  URL.revokeObjectURL(url)
}

//export reports pdf
export async function exportReportsPdf(): Promise<void> {
  const response = await axiosClient.get('/admin/report/export-pdf', {
    responseType: 'blob',
  })

  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'reports.pdf'
  link.click()
  URL.revokeObjectURL(url)
}

//export statistics pdf
export async function exportStatisticsPdf(): Promise<void> {
  const response = await axiosClient.get('/admin/statistic/export-pdf', {
    responseType: 'blob',
  })

  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'statistics.pdf'
  link.click()
  URL.revokeObjectURL(url)
}

const mockPostData = {
  data: {
    posts: [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        author: {
          id: 1,
          full_name: 'Author 1',
          email: 'author1@example.com',
        },
        category: {
          id: 1,
          category_name: 'Category 1',
        },
        status: 'Pending',
        visibility: 'Public',
        is_edited: false,
        likes: 10,
        comments: 5,
        shares: 2,
        liked: false,
      },
    ],
  },
}
//get list posts
export function useGetPostList() {
  return useQuery({
    queryKey: ['post-list'],
    // queryFn: () => axiosClient.get<Response<Post[]>>('/admin/posts'),
    queryFn: () => ({ data: mockPostData }),
  })
}

//validate post
export function useValidatePost() {
  return useMutation({
    mutationFn: (payload: ValidatePostRequest) => axiosClient.put<Response<undefined>>(`/admin/posts/${payload.id}/validate`, payload),
    onSuccess: (data) => {
      toast.success('Post validated successfully')
      // queryClient.invalidateQueries({ queryKey: ['post-list'] })
    },
  })
}

//get statistics
export function useGetStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => axiosClient.get<Statistics>('/admin/statistic'),
  })
}

