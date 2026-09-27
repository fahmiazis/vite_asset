import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { createStockOpnamePhysicalStatusMaster } from "../../../services/stockOpname/statusMaster"

export function useCreateStockOpnamePhysicalStatusMaster() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStockOpnamePhysicalStatusMaster,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-physical-status-masters"] })
      toast.success(data.message || "Status fisik berhasil ditambahkan")
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Gagal menambahkan status fisik"
      toast.error(errorMessage)
    },
  })
}
