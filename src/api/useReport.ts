import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getReportList, validateReport } from './reportApi'
import type { ReportStatus } from '#/types/report'

export const useGetReportList = () => {
  return useQuery({
    queryKey: ['report', 'list'],
    queryFn: () => getReportList(),
  })
}

export const useValidateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: number; status: ReportStatus }) => validateReport(reportId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', 'list'] })
    },
  })
}