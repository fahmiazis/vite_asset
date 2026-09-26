import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { assignRolesToUser, type AssignRolesRequest } from "../../../services/users/assignRoles"

interface UseAssignRolesParams {
  userId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useAssignRoles({ userId, onSuccess, onError }: UseAssignRolesParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AssignRolesRequest) => assignRolesToUser(userId, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-detail", userId] })
      queryClient.invalidateQueries({ queryKey: ["user-list"] })
      // sidebar user lain bisa berubah kalau rolenya diubah
      queryClient.invalidateQueries({ queryKey: ["sidebar-list"] })

      toast.success(data?.message || "Role user berhasil diperbarui")
      onSuccess?.()
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Gagal memperbarui role user"
      toast.error(message)
      onError?.(error)
    },
  })
}
