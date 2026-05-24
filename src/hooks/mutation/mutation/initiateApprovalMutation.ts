import { useMutation, useQueryClient } from "@tanstack/react-query"
import { initiateApprovalMutation } from "../../../services/mutation/initiateApprovalMutation"

export function useInitiateApprovalMutation(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => initiateApprovalMutation(transactionNumber),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mutation-detail"],
      })
    },
  })
}