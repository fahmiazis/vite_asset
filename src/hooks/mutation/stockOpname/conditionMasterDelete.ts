import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { deleteStockOpnameConditionMaster } from "../../../services/stockOpname/statusMaster"

export function useDeleteStockOpnameConditionMaster() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteStockOpnameConditionMaster(id),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-condition-masters"] })
      toast.success(data.message || "Kondisi berhasil dihapus")
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Gagal menghapus kondisi"
      toast.error(errorMessage)
    },
  })
}
