import { axiosPrivate } from "../../libs/instance"

export const initiateApprovalStockOpname = async (transactionNumber: string) => {
  const res = await axiosPrivate.post(
    "/transactions/stock-opname/approval/initiate",
    {},
    { params: { transaction_number: transactionNumber } }
  )

  if (!res) {
    throw new Error("fail to initiate approval stock opname")
  }

  return res.data
}
