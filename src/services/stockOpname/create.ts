import { axiosPrivate } from "../../libs/instance"
import type { CreateStockOpnameDraftRequest, CreateStockOpnameDraftResponse } from "../../models/stockOpname/create"

export const createStockOpnameDraft = async (
  payload: CreateStockOpnameDraftRequest
): Promise<CreateStockOpnameDraftResponse> => {
  const res = await axiosPrivate.post<CreateStockOpnameDraftResponse>("/transactions/stock-opname", payload)
  return res.data
}
