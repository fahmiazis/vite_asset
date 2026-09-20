import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { uploadStockOpnameBorrowDocument } from "../../../services/stockOpname/uploadBorrowDocument"

interface UseUploadStockOpnameBorrowDocumentParams {
  transactionNumber: string
}

export function useUploadStockOpnameBorrowDocument({ transactionNumber }: UseUploadStockOpnameBorrowDocumentParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assetId, file }: { assetId: number; file: File }) =>
      uploadStockOpnameBorrowDocument(transactionNumber, assetId, file),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })
      toast.success(data.message || "Dokumen peminjaman berhasil diupload")
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal upload dokumen peminjaman"
      toast.error(errorMessage)
    },
  })
}
