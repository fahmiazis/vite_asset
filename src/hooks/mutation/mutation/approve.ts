import { useMutation, useQueryClient } from "@tanstack/react-query"
import { approveTransactionApproval, type ApproveTransactionApprovalPayload } from "../../../services/mutation/approve"

export function useApproveTransactionApproval(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ApproveTransactionApprovalPayload) =>
      approveTransactionApproval(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mutation-approval-status", transactionNumber],
      })
      queryClient.invalidateQueries({
        queryKey: ["mutation-draft-detail", transactionNumber],
      })
    },
  })
}