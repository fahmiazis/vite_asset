import { axiosPrivate } from "../../libs/instance"
import type { approvalStatusStockOpnameProps } from "../../models/stockOpname/approvalStatus"

export const approvalStatusStockOpnameDetail = async (
  transactionNumber: string
): Promise<approvalStatusStockOpnameProps> => {
  const res = await axiosPrivate.get("/transactions/stock-opname/approval/status", {
    params: { transaction_number: transactionNumber },
  })

  if (!res) {
    throw new Error("fail to get approval status stock opname")
  }

  return res.data
}
