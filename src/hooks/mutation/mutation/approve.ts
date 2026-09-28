import { useMutation, useQueryClient } from "@tanstack/react-query"
import { approveTransactionApproval, type ApproveTransactionApprovalPayload } from "../../../services/mutation/approve"
import { refreshMutationQueries } from "./refresh"

export function useApproveTransactionApproval(_transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ApproveTransactionApprovalPayload) =>
      approveTransactionApproval(payload),

    onSuccess: () => {
      refreshMutationQueries(queryClient)
    },
  })
}