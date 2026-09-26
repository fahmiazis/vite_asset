import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import type { CreateRoleRequest } from "../../../models/roles/detail"
import { createRole } from "../../../services/roles/create"

interface UseCreateRoleParams {
  onSuccess?: () => void
  onError?: (error: Error) => void
  redirectOnSuccess?: boolean
}

export function useCreateRole({
  onSuccess,
  onError,
  redirectOnSuccess = true,
}: UseCreateRoleParams = {}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: CreateRoleRequest) => createRole(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["role-list"] })
      toast.success(data?.message || "Role berhasil dibuat")

      if (redirectOnSuccess) navigate("/dashboard/role")
      onSuccess?.()
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Gagal membuat role"
      toast.error(message)
      onError?.(error)
    },
  })
}
