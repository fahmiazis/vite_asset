import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { uploadDisposalAttachment, type UploadDisposalAttachmentParams, type UploadDisposalAttachmentPayload } from "../../../services/disposal/uploadAttachmentDisposal"

interface UseUploadDisposalAttachmentOptions {
    onSuccess?: () => void
    onError?: (error: Error) => void
}

export function useUploadDisposalAttachment({
    onSuccess,
    onError,
}: UseUploadDisposalAttachmentOptions = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            params,
            payload,
        }: {
            params: UploadDisposalAttachmentParams
            payload: UploadDisposalAttachmentPayload
        }) => uploadDisposalAttachment(params, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["transaction-detail-with-stage"],
            })
            queryClient.invalidateQueries({
                queryKey: ["attachments"],
            })

            toast.success("Attachment uploaded successfully")
            onSuccess?.()
        },

        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to upload attachment"

            toast.error(errorMessage)
            onError?.(error)
        },
    })
}