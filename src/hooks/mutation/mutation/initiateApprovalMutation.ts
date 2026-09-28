import { useMutation, useQueryClient } from "@tanstack/react-query"
import { initiateApprovalMutation } from "../../../services/mutation/initiateApprovalMutation"
import { refreshMutationQueries } from "./refresh"

export function useInitiateApprovalMutation(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => initiateApprovalMutation(transactionNumber),

    onSuccess: () => {
      refreshMutationQueries(queryClient)
    },
  })
}