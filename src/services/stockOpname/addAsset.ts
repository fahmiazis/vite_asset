import { axiosPrivate } from "../../libs/instance"
import type { AddStockOpnameAssetRequest, AddStockOpnameAssetResponse } from "../../models/stockOpname/addAsset"

export const addAssetToStockOpname = async (
  transactionNumber: string,
  payload: AddStockOpnameAssetRequest
): Promise<AddStockOpnameAssetResponse> => {
  const res = await axiosPrivate.post<AddStockOpnameAssetResponse>(
    "/transactions/stock-opname/draft/add-asset",
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return res.data
}
