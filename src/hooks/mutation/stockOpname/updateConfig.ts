import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { updateStockOpnameConfig } from "../../../services/stockOpname/config"

export function useUpdateStockOpnameConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStockOpnameConfig,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-config"] })
      toast.success(data.message || "Config berhasil disimpan")
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal menyimpan config"
      toast.error(errorMessage)
    },
  })
}
