import { axiosPrivate } from "../../libs/instance"
import type { UpdateStockOpnameFindingRequest, UpdateStockOpnameFindingResponse } from "../../models/stockOpname/updateFinding"

export const updateStockOpnameFinding = async (
  transactionNumber: string,
  payload: UpdateStockOpnameFindingRequest
): Promise<UpdateStockOpnameFindingResponse> => {
  const res = await axiosPrivate.put<UpdateStockOpnameFindingResponse>(
    "/transactions/stock-opname/draft/update-finding",
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return res.data
}
