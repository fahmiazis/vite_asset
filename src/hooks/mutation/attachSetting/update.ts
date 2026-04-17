// hooks/mutation/attachment-setting/useUpdateAttachmentSetting.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAttachmentSetting, type UpdateAttachmentSettingPayload } from "../../../services/attachmentSetting/update"

export function useUpdateAttachmentSetting(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAttachmentSettingPayload) =>
      updateAttachmentSetting(id, payload),

    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["attachment-setting-list"] })
      queryClient.resetQueries({ queryKey: ["attachment-setting-list", ""] })
      queryClient.resetQueries({ queryKey: ["attachment-setting-detail", id] })
    },
  })
}