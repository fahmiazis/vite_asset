import { axiosPrivate } from "../../libs/instance"
import type { StockOpnameReportFilterParams, stockOpnameDashboardReportProps } from "../../models/stockOpname/report"

export const stockOpnameReportDashboard = async (
  params: StockOpnameReportFilterParams
): Promise<stockOpnameDashboardReportProps> => {
  const res = await axiosPrivate.get("/transactions/stock-opname/report/dashboard", { params })

  if (!res) {
    throw new Error("fail to get stock opname report dashboard")
  }

  return res.data
}
