import { axiosPrivate } from "../../libs/instance"
import type { StockOpnameReportFilterParams, stockOpnameDetailReportProps } from "../../models/stockOpname/report"

export const stockOpnameReportDetail = async (
  params: StockOpnameReportFilterParams
): Promise<stockOpnameDetailReportProps> => {
  const res = await axiosPrivate.get("/transactions/stock-opname/report/detail", { params })

  if (!res) {
    throw new Error("fail to get stock opname detail report")
  }

  return res.data
}
