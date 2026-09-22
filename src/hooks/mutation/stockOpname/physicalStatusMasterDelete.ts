import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { deleteStockOpnamePhysicalStatusMaster } from "../../../services/stockOpname/statusMaster"

export function useDeleteStockOpnamePhysicalStatusMaster() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteStockOpnamePhysicalStatusMaster(id),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-physical-status-masters"] })
      toast.success(data.message || "Status fisik berhasil dihapus")
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Gagal menghapus status fisik"
      toast.error(errorMessage)
    },
  })
}
