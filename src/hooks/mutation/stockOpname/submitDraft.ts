import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { SubmitStockOpnameRequest } from "../../../models/stockOpname/submitDraft"
import { submitStockOpname } from "../../../services/stockOpname/submitDraft"

interface UseSubmitStockOpnameParams {
  transactionNumber: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useSubmitStockOpname({
  transactionNumber,
  onSuccess,
  onError,
}: UseSubmitStockOpnameParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitStockOpnameRequest) =>
      submitStockOpname(transactionNumber, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })
      onSuccess?.()
    },

    onError: (error: any) => {
      onError?.(error)
    },
  })
}
