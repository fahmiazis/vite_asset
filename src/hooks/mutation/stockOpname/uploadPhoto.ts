import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { uploadStockOpnamePhoto } from "../../../services/stockOpname/uploadPhoto"

interface UseUploadStockOpnamePhotoParams {
  transactionNumber: string
}

export function useUploadStockOpnamePhoto({ transactionNumber }: UseUploadStockOpnamePhotoParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assetId, file }: { assetId: number; file: File }) =>
      uploadStockOpnamePhoto(transactionNumber, assetId, file),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })
      toast.success(data.message || "Foto berhasil diupload")
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal upload foto"
      toast.error(errorMessage)
    },
  })
}
