import axiosClient from './axiosClient'
import type { Pagination } from '#/types/response'
import type { Report, ReportStatus } from '#/types/report'


export const getReportList = async (): Promise<Pagination<Report[]>> => {
  const res = await axiosClient.get<Pagination<Report[]>>('/admin/report')
  return res.data
}

export const validateReport = async (reportId: number, status: ReportStatus): Promise<void> => {
  const res = await axiosClient.put<void>(`/admin/report/${reportId}/validate`, { status })
  return res.data
}

