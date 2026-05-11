// hooks/mutation/transaction/useExecuteMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { executeMutation, type ExecuteMutationPayload } from "../../../services/mutation/executeMutation"

export function useExecuteMutation(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ExecuteMutationPayload) =>
      executeMutation(transactionNumber, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mutation-draft-detail", transactionNumber],
      })
    },
  })
}