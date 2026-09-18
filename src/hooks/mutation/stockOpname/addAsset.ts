import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import type { AddStockOpnameAssetRequest } from "../../../models/stockOpname/addAsset"
import { addAssetToStockOpname } from "../../../services/stockOpname/addAsset"

interface UseAddAssetToStockOpnameParams {
  transactionNumber: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useAddAssetToStockOpname({
  transactionNumber,
  onSuccess,
  onError,
}: UseAddAssetToStockOpnameParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddStockOpnameAssetRequest) =>
      addAssetToStockOpname(transactionNumber, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })

      toast.success(data.message || "Aset berhasil ditambahkan")
      onSuccess?.()
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal menambahkan aset"

      toast.error(errorMessage)
      onError?.(error)
    },
  })
}
