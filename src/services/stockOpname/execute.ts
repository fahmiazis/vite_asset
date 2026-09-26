import { axiosPrivate } from "../../libs/instance"
import type { ExecuteStockOpnameRequest, ExecuteStockOpnameResponse } from "../../models/stockOpname/execute"

export const executeStockOpname = async (
  transactionNumber: string,
  payload: ExecuteStockOpnameRequest
): Promise<ExecuteStockOpnameResponse> => {
  const res = await axiosPrivate.post<ExecuteStockOpnameResponse>(
    "/transactions/stock-opname/execute",
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return res.data
}
