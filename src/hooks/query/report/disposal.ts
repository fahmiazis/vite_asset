import { useQuery } from "@tanstack/react-query"
import type { ReportFilterParams } from "../../../models/report/common"
import type { DisposalReportResponse } from "../../../models/report/disposal"
import { disposalReport } from "../../../services/report/disposal"

export const useDisposalReport = (params: ReportFilterParams) => {
  const { data, isLoading, isFetching, error } = useQuery<DisposalReportResponse>({
    queryKey: ["disposal-report", params],
    queryFn: () => disposalReport(params),
    placeholderData: (prev) => prev,
  })

  return { data, isLoading, isFetching, error }
}
