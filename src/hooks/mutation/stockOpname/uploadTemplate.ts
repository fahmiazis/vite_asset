import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { uploadStockOpnameTemplate } from "../../../services/stockOpname/uploadTemplate"

interface UseUploadStockOpnameTemplateParams {
  transactionNumber: string
}

export function useUploadStockOpnameTemplate({ transactionNumber }: UseUploadStockOpnameTemplateParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadStockOpnameTemplate(transactionNumber, file),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })
      toast.success(data.message || "Template berhasil diproses")
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal memproses template"
      toast.error(errorMessage)
    },
  })
}
