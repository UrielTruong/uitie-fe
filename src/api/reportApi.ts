import axiosClient from './axiosClient'
import type { Pagination } from '#/types/response'
import type { Report, ReportStatus } from '#/types/report'

// --- API dành cho Admin ---
export const getReportList = async (): Promise<Pagination<Report[]>> => {
  const res = await axiosClient.get<Pagination<Report[]>>('/admin/report')
  return res.data
}

export const validateReport = async (reportId: number, status: ReportStatus): Promise<void> => {
  const res = await axiosClient.put<void>(`/admin/report/${reportId}/validate`, { status })
  return res.data
}

// --- API dành cho Người dùng (Thêm mới) ---
export const createReport = async (payload: { post_id: number; reason: string }): Promise<any> => {
  const res = await axiosClient.post('/reports', payload)
  return res.data
}

// Gom tất cả vào một đối tượng để dễ quản lý (optional)
export const reportApi = {
  getReportList,
  validateReport,
  createReport,
}