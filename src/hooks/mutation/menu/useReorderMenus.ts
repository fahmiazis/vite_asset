import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import type { ReorderMenusRequest } from "../../../models/menu/reorder"
import { reorderMenus } from "../../../services/menu/reorder"

interface UseReorderMenusParams {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useReorderMenus({ onSuccess, onError }: UseReorderMenusParams = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReorderMenusRequest) => reorderMenus(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["menu-list"] })
      queryClient.invalidateQueries({ queryKey: ["sidebar-list"] })

      toast.success(data?.message || "Urutan menu tersimpan")
      onSuccess?.()
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Gagal menyimpan urutan menu"
      toast.error(message)
      onError?.(error)
    },
  })
}
