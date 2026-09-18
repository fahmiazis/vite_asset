import { useQuery } from "@tanstack/react-query"
import type { StockOpnameReportFilterParams, stockOpnameDetailReportProps } from "../../../models/stockOpname/report"
import { stockOpnameReportDetail } from "../../../services/stockOpname/reportDetail"

export const useStockOpnameReportDetail = (params: StockOpnameReportFilterParams, enabled: boolean) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery<stockOpnameDetailReportProps>({
    queryKey: ["stock-opname-report-detail", params.month, params.year, params.branch_code ?? "ALL"],
    queryFn: () => stockOpnameReportDetail(params),
    placeholderData: (prev) => prev,
    enabled,
  })

  return { data, isLoading, isFetching, error, refetch }
}
