import { useQuery } from "@tanstack/react-query"
import type { ReportFilterParams } from "../../../models/report/common"
import type { MutationReportResponse } from "../../../models/report/mutation"
import { mutationReport } from "../../../services/report/mutation"

export const useMutationReport = (params: ReportFilterParams) => {
  const { data, isLoading, isFetching, error } = useQuery<MutationReportResponse>({
    queryKey: ["mutation-report", params],
    queryFn: () => mutationReport(params),
    placeholderData: (prev) => prev,
  })

  return { data, isLoading, isFetching, error }
}
