import { axiosPrivate } from "../../libs/instance"
import type { stockOpnameListProps } from "../../models/stockOpname/list"

export interface StockOpnameListParams {
  page: number
  limit: number
  status?: string
  current_stage?: string
}

export const stockOpnameList = async (params: StockOpnameListParams): Promise<stockOpnameListProps> => {
  const { page, limit, status, current_stage } = params

  const res = await axiosPrivate.get("/transactions/stock-opname", {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
      ...(current_stage ? { current_stage } : {}),
    },
  })

  if (!res) {
    throw new Error("fail to get list stock opname")
  }

  return res.data
}
