import { useQuery } from "@tanstack/react-query"
import type { StockOpnameReportFilterParams, stockOpnameDashboardReportProps } from "../../../models/stockOpname/report"
import { stockOpnameReportDashboard } from "../../../services/stockOpname/reportDashboard"

export const useStockOpnameReportDashboard = (params: StockOpnameReportFilterParams) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery<stockOpnameDashboardReportProps>({
    queryKey: ["stock-opname-report-dashboard", params.month, params.year, params.branch_code ?? "ALL"],
    queryFn: () => stockOpnameReportDashboard(params),
    placeholderData: (prev) => prev,
  })

  return { data, isLoading, isFetching, error, refetch }
}
