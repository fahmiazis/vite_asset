import { axiosPrivate } from "../../libs/instance"
import type {
  BulkUpdateStockOpnameFindingRequest,
  BulkUpdateStockOpnameFindingResponse,
} from "../../models/stockOpname/bulkUpdateFinding"

export const bulkUpdateStockOpnameFinding = async (
  transactionNumber: string,
  payload: BulkUpdateStockOpnameFindingRequest
): Promise<BulkUpdateStockOpnameFindingResponse> => {
  const res = await axiosPrivate.put<BulkUpdateStockOpnameFindingResponse>(
    "/transactions/stock-opname/draft/bulk-update-finding",
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return res.data
}
