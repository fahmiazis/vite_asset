import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import {
  uploadMutationAttachment,
  type UploadMutationAttachmentParams,
  type UploadMutationAttachmentPayload,
} from "../../../services/mutation/uploadAttachment"

interface UseUploadMutationAttachmentOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useUploadMutationAttachment({
  onSuccess,
  onError,
}: UseUploadMutationAttachmentOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      params,
      payload,
    }: {
      params: UploadMutationAttachmentParams
      payload: UploadMutationAttachmentPayload
    }) => uploadMutationAttachment(params, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mutation-detail"] })
      queryClient.invalidateQueries({ queryKey: ["mutation-attachment-status"] })

      toast.success("Dokumen berhasil diunggah")
      onSuccess?.()
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Gagal mengunggah dokumen"
      toast.error(errorMessage)
      onError?.(error)
    },
  })
}
