import { axiosPrivate } from "../../libs/instance"
import type { RejectStockOpnameRequest, RejectStockOpnameResponse } from "../../models/stockOpname/reject"

export const rejectStockOpname = async (
  transactionNumber: string,
  payload: RejectStockOpnameRequest
): Promise<RejectStockOpnameResponse> => {
  const res = await axiosPrivate.post<RejectStockOpnameResponse>(
    "/transactions/stock-opname/reject",
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return res.data
}
