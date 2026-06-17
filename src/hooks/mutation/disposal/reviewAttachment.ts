import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { reviewDisposalAttachment, type ReviewDisposalAttachmentParams, type ReviewDisposalAttachmentPayload } from "../../../services/disposal/reviewAttchment"

interface UseReviewDisposalAttachmentOptions {
    onSuccess?: () => void
    onError?: (error: Error) => void
}

export function useReviewDisposalAttachment({
    onSuccess,
    onError,
}: UseReviewDisposalAttachmentOptions = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            params,
            payload,
        }: {
            params: ReviewDisposalAttachmentParams
            payload: ReviewDisposalAttachmentPayload
        }) => reviewDisposalAttachment(params, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["transaction-detail-with-stage"],
            })
            queryClient.invalidateQueries({
                queryKey: ["attachments"],
            })

            toast.success("Attachment reviewed successfully")
            onSuccess?.()
        },

        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to review attachment"

            toast.error(errorMessage)
            onError?.(error)
        },
    })
}