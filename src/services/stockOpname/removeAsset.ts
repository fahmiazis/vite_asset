import { axiosPrivate } from "../../libs/instance"
import type { RemoveStockOpnameAssetRequest, RemoveStockOpnameAssetResponse } from "../../models/stockOpname/removeAsset"

export const removeAssetFromStockOpname = async (
  transactionNumber: string,
  payload: RemoveStockOpnameAssetRequest
): Promise<RemoveStockOpnameAssetResponse> => {
  const res = await axiosPrivate.delete<RemoveStockOpnameAssetResponse>(
    "/transactions/stock-opname/draft/remove-asset",
    {
      params: { transaction_number: transactionNumber },
      data: payload,
    }
  )
  return res.data
}
