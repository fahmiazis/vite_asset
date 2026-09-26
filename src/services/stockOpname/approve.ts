import { axiosPrivate } from "../../libs/instance"

export interface ApproveStockOpnamePayload {
  transaction_approval_id: string
  notes: string
}

export const approveStockOpname = async (payload: ApproveStockOpnamePayload) => {
  const res = await axiosPrivate.post("/transaction-approvals/approve", payload)

  if (!res) {
    throw new Error("fail to approve stock opname")
  }

  return res.data
}
