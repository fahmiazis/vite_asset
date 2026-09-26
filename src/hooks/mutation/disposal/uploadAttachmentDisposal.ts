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
            // prefix match — refresh detail & status attachment disposal manapun
            queryClient.invalidateQueries({ queryKey: ["disposal-detail"] })
            queryClient.invalidateQueries({ queryKey: ["disposal-attachment-status"] })

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
