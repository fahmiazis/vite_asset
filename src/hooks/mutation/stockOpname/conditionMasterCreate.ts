import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { createStockOpnameConditionMaster } from "../../../services/stockOpname/statusMaster"

export function useCreateStockOpnameConditionMaster() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStockOpnameConditionMaster,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-condition-masters"] })
      toast.success(data.message || "Kondisi berhasil ditambahkan")
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Gagal menambahkan kondisi"
      toast.error(errorMessage)
    },
  })
}
