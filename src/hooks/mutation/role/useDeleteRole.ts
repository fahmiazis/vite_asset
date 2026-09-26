import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { deleteRole } from "../../../services/roles/delete"

interface UseDeleteRoleParams {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useDeleteRole({ onSuccess, onError }: UseDeleteRoleParams = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["role-list"] })
      toast.success(data?.message || "Role berhasil dihapus")
      onSuccess?.()
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Gagal menghapus role"
      toast.error(message)
      onError?.(error)
    },
  })
}
