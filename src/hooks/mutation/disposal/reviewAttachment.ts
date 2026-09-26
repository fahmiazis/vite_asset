import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import {
  reviewDisposalAttachment,
  type ReviewDisposalAttachmentPayload,
} from "../../../services/disposal/reviewAttachment"

interface UseReviewDisposalAttachmentParams {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useReviewDisposalAttachment({
  onSuccess,
  onError,
}: UseReviewDisposalAttachmentParams = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ReviewDisposalAttachmentPayload }) =>
      reviewDisposalAttachment(id, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["disposal-detail"] })
      queryClient.invalidateQueries({ queryKey: ["disposal-attachment-status"] })

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
