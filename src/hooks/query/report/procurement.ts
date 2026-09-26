import { useQuery } from "@tanstack/react-query"
import type { ReportFilterParams } from "../../../models/report/common"
import type { ProcurementReportResponse } from "../../../models/report/procurement"
import { procurementReport } from "../../../services/report/procurement"

export const useProcurementReport = (params: ReportFilterParams) => {
  const { data, isLoading, isFetching, error } = useQuery<ProcurementReportResponse>({
    queryKey: ["procurement-report", params],
    queryFn: () => procurementReport(params),
    placeholderData: (prev) => prev,
  })

  return { data, isLoading, isFetching, error }
}
