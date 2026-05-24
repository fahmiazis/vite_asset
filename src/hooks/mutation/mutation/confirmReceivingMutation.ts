import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirmReceivingMutation } from "../../../services/mutation/confirmReceivingMutation"

export function useConfirmReceivingMutation(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => confirmReceivingMutation(transactionNumber),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mutation-draft-detail", transactionNumber],
      })
    },
  })
}