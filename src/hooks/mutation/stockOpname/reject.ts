import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import type { RejectStockOpnameRequest } from "../../../models/stockOpname/reject"
import { rejectStockOpname } from "../../../services/stockOpname/reject"

interface UseRejectStockOpnameParams {
  transactionNumber: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useRejectStockOpname({
  transactionNumber,
  onSuccess,
  onError,
}: UseRejectStockOpnameParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RejectStockOpnameRequest) =>
      rejectStockOpname(transactionNumber, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })
      queryClient.invalidateQueries({ queryKey: ["stock-opname-list"] })

      toast.success(data.message || "Stock opname berhasil ditolak")
      onSuccess?.()
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal menolak stock opname"

      toast.error(errorMessage)
      onError?.(error)
    },
  })
}
