import { axiosPrivate } from "../../libs/instance"
import type { stockOpnameDetailProps } from "../../models/stockOpname/detail"

export const stockOpnameDetail = async (transactionNumber: string): Promise<stockOpnameDetailProps> => {
  const res = await axiosPrivate.get("/transactions/stock-opname/detail", {
    params: { transaction_number: transactionNumber },
  })

  if (!res) {
    throw new Error("fail to get detail stock opname")
  }

  return res.data
}
