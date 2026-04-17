import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAttachmentSetting } from "../../../services/attachmentSetting/delete"

export function useDeleteAttachmentSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAttachmentSetting(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachment-setting-list"] })
    },
  })
}