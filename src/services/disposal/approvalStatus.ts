import { axiosPrivate } from "../../libs/instance"
import type { approvalStatusMutationProps } from "../../models/mutation/approvalStatus"

/**
 * Approval request & agreement memakai bentuk response yang sama
 * (backend: services.GetTransactionApprovalStatus).
 */
export type disposalApprovalStatusProps = approvalStatusMutationProps

export type DisposalApprovalKind = "approval-request" | "approval-agreement"

export const disposalApprovalStatus = async (
  transactionNumber: string,
  kind: DisposalApprovalKind
): Promise<disposalApprovalStatusProps> => {
  const res = await axiosPrivate.get(`/transactions/disposal/${kind}/status`, {
    params: { transaction_number: transactionNumber },
  })

  if (!res) {
    throw new Error("fail to get disposal approval status")
  }

  return res.data
}
