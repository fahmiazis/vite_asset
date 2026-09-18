import { axiosPrivate } from "../../libs/instance"
import type { SubmitStockOpnameRequest, SubmitStockOpnameResponse } from "../../models/stockOpname/submitDraft"

export const submitStockOpname = async (
  transactionNumber: string,
  payload: SubmitStockOpnameRequest
): Promise<SubmitStockOpnameResponse> => {
  const res = await axiosPrivate.post<SubmitStockOpnameResponse>(
    "/transactions/stock-opname/draft/submit",
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return res.data
}
