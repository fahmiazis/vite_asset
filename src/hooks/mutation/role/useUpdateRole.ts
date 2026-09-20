import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import type { UpdateRoleRequest } from "../../../models/roles/detail"
import { updateRole } from "../../../services/roles/update"

interface UseUpdateRoleParams {
  roleId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useUpdateRole({ roleId, onSuccess, onError }: UseUpdateRoleParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateRoleRequest) => updateRole(roleId, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["role-list"] })
      queryClient.invalidateQueries({ queryKey: ["role-detail", roleId] })

      toast.success(data?.message || "Role berhasil diperbarui")
      onSuccess?.()
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Gagal memperbarui role"
      toast.error(message)
      onError?.(error)
    },
  })
}
