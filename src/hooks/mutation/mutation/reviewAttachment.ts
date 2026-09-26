import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import {
  reviewMutationAttachment,
  type ReviewMutationAttachmentPayload,
} from "../../../services/mutation/reviewAttachment"

interface UseReviewMutationAttachmentParams {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useReviewMutationAttachment({
  onSuccess,
  onError,
}: UseReviewMutationAttachmentParams = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ReviewMutationAttachmentPayload }) =>
      reviewMutationAttachment(id, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mutation-detail"] })
      queryClient.invalidateQueries({ queryKey: ["mutation-attachment-status"] })

      toast.success(data?.message || "Review dokumen tersimpan")
      onSuccess?.()
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Gagal mereview dokumen"
      toast.error(errorMessage)
      onError?.(error)
    },
  })
}
