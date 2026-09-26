import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import type { UpdateStockOpnameFindingRequest } from "../../../models/stockOpname/updateFinding"
import { updateStockOpnameFinding } from "../../../services/stockOpname/updateFinding"

interface UseUpdateStockOpnameFindingParams {
  transactionNumber: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useUpdateStockOpnameFinding({
  transactionNumber,
  onSuccess,
  onError,
}: UseUpdateStockOpnameFindingParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateStockOpnameFindingRequest) =>
      updateStockOpnameFinding(transactionNumber, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })

      toast.success(data.message || "Temuan berhasil disimpan")
      onSuccess?.()
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal menyimpan temuan"

      toast.error(errorMessage)
      onError?.(error)
    },
  })
}
