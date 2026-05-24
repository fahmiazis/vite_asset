import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import type { AddAssetToDisposalRequest } from "../../../models/disposal/addAsset"
import { addAssetToDisposal } from "../../../services/disposal/addAsset"

interface UseAddAssetToDisposalParams {
  transactionNumber: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useAddAssetToDisposal({
  transactionNumber,
  onSuccess,
  onError,
}: UseAddAssetToDisposalParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddAssetToDisposalRequest) =>
      addAssetToDisposal(transactionNumber, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["disposal-detail", transactionNumber],
      })

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