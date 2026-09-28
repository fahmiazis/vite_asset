import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirmReceivingMutation } from "../../../services/mutation/confirmReceivingMutation"
import { refreshMutationQueries } from "./refresh"

export function useConfirmReceivingMutation(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => confirmReceivingMutation(transactionNumber),

    onSuccess: () => {
      refreshMutationQueries(queryClient)
    },
  })
}