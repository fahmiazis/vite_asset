import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { updateStockOpnamePhysicalStatusConditions } from "../../../services/stockOpname/statusMaster"

export function useUpdateStockOpnamePhysicalStatusConditions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStockOpnamePhysicalStatusConditions,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-physical-status-masters"] })
      toast.success(data.message || "Kondisi status fisik berhasil diperbarui")
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Gagal memperbarui kondisi status fisik"
      toast.error(errorMessage)
    },
  })
}
