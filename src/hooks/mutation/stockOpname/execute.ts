import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import type { ExecuteStockOpnameRequest } from "../../../models/stockOpname/execute"
import { executeStockOpname } from "../../../services/stockOpname/execute"

interface UseExecuteStockOpnameParams {
  transactionNumber: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useExecuteStockOpname({
  transactionNumber,
  onSuccess,
  onError,
}: UseExecuteStockOpnameParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ExecuteStockOpnameRequest) =>
      executeStockOpname(transactionNumber, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })

      toast.success(data.message || "Stock opname berhasil dieksekusi")
      onSuccess?.()
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal mengeksekusi stock opname"

      toast.error(errorMessage)
      onError?.(error)
    },
  })
}
