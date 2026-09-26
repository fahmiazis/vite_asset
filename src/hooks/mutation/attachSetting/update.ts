// hooks/mutation/attachment-setting/useUpdateAttachmentSetting.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAttachmentSetting, type UpdateAttachmentSettingPayload } from "../../../services/attachmentSetting/update"

export function useUpdateAttachmentSetting(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAttachmentSettingPayload) =>
      updateAttachmentSetting(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachment-setting-list"] })
      // FIX: query detail memakai key 'attach-setting-detail'
      // (hooks/query/attachmentSetting/detail.ts), bukan 'attachment-setting-detail',
      // jadi reset yang lama tidak pernah mengenai cache mana pun
      queryClient.invalidateQueries({ queryKey: ["attach-setting-detail", id] })
    },
  })
}