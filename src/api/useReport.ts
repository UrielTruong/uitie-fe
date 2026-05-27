import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getReportList, validateReport, createReport, createUserReport } from './reportApi'
import type { ReportStatus } from '#/types/report'
import { toast } from 'react-hot-toast'

// Hook lấy danh sách báo cáo (Dành cho Admin)
export const useGetReportList = () => {
  return useQuery({
    queryKey: ['report', 'list'],
    queryFn: () => getReportList(),
  })
}

// Hook phê duyệt/xử lý báo cáo (Dành cho Admin)
export const useValidateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: number; status: ReportStatus }) => 
      validateReport(reportId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', 'list'] })
      toast.success('Cập nhật trạng thái báo cáo thành công!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái.')
    }
  })
}

// Hook gửi báo cáo mới (Dành cho Người dùng)
export const useCreateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    // Nhận tham số object có postId và reason
    mutationFn: ({ postId, reason }: { postId: number | string; reason: string }) => 
      createReport(postId, { reason }),
    onSuccess: () => {
      // Làm mới danh sách báo cáo nếu admin đang xem và làm tươi bài viết ngoài Feed sinh viên
      queryClient.invalidateQueries({ queryKey: ['report', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Gửi báo cáo vi phạm thành công!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gửi báo cáo thất bại.')
    },
  })
}
// Hook gửi báo cáo Tài khoản vi phạm (bổ sung cho Student)
export const useCreateUserReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number | string; reason: string }) => 
      createUserReport(userId, { reason }),
    onSuccess: () => {
      // Làm tươi danh sách báo cáo bên admin và danh sách user nếu cần
      queryClient.invalidateQueries({ queryKey: ['report', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Báo cáo tài khoản vi phạm thành công!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Báo cáo tài khoản thất bại.')
    },
  })
}