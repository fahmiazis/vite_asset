import { axiosPrivate } from "../../libs/instance"

export interface ApproveTransactionApprovalPayload {
  transaction_approval_id: string
  notes: string
}

export const approveTransactionApproval = async (
  payload: ApproveTransactionApprovalPayload
) => {
  const res = await axiosPrivate.post(
    `/transaction-approvals/approve`,
    payload
  )

  if (!res) {
    throw new Error("fail to approve transaction approval")
  }

  return res.data
}