import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import type { CreateStockOpnameDraftRequest } from "../../../models/stockOpname/create"
import { createStockOpnameDraft } from "../../../services/stockOpname/create"

interface UseCreateStockOpnameDraftParams {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useCreateStockOpnameDraft({
  onSuccess,
  onError,
}: UseCreateStockOpnameDraftParams = {}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: CreateStockOpnameDraftRequest) => createStockOpnameDraft(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-list"] })

      toast.success(data.message || "Stock opname berhasil dibuat")

      navigate(`/dashboard/stock-opname/${data.data.transaction.transaction_number}`)

      onSuccess?.()
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal membuat stock opname"

      toast.error(errorMessage)
      onError?.(error)
    },
  })
}
