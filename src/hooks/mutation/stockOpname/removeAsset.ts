import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import type { RemoveStockOpnameAssetRequest } from "../../../models/stockOpname/removeAsset"
import { removeAssetFromStockOpname } from "../../../services/stockOpname/removeAsset"

interface UseRemoveAssetFromStockOpnameParams {
  transactionNumber: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useRemoveAssetFromStockOpname({
  transactionNumber,
  onSuccess,
  onError,
}: UseRemoveAssetFromStockOpnameParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RemoveStockOpnameAssetRequest) =>
      removeAssetFromStockOpname(transactionNumber, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })

      toast.success(data.message || "Aset berhasil dihapus dari stock opname")
      onSuccess?.()
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal menghapus aset dari stock opname"

      toast.error(errorMessage)
      onError?.(error)
    },
  })
}
