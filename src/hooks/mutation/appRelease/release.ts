import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createAppRelease,
  deleteAppRelease,
  type CreateAppReleasePayload,
} from "../../../services/appRelease/release"

export function useCreateAppRelease(onProgress?: (percent: number) => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAppReleasePayload) => createAppRelease(payload, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-release-list"] })
    },
  })
}

export function useDeleteAppRelease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAppRelease(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-release-list"] })
    },
  })
}
