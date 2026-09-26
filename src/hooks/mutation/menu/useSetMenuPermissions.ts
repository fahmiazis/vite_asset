import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { setMenuPermissions } from "../../../services/menu/menuPermissions"
import type { SetMenuPermissionsRequest } from "../../../models/menu/permissionCatalog"

interface UseSetMenuPermissionsParams {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useSetMenuPermissions({
  onSuccess,
  onError,
}: UseSetMenuPermissionsParams = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      menuId,
      payload,
    }: {
      menuId: string
      payload: SetMenuPermissionsRequest
    }) => setMenuPermissions(menuId, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["permission-catalog"] })
      toast.success(data?.message || "Hak akses menu diperbarui")
      onSuccess?.()
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Gagal memperbarui hak akses menu"
      toast.error(message)
      onError?.(error)
    },
  })
}
