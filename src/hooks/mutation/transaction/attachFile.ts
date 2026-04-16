import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { uploadAttachment, type UploadAttachmentParams, type UploadAttachmentPayload } from '../../../services/transaction/uploadAttachment'

interface UseUploadAttachmentParams {
    onSuccess?: () => void
    onError?: (error: Error) => void
}

export function useUploadAttachment({
    onSuccess,
    onError,
}: UseUploadAttachmentParams = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            params,
            payload,
        }: {
            params: UploadAttachmentParams
            payload: UploadAttachmentPayload
        }) => uploadAttachment(params, payload),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['attachments'],
            })

            toast.success('Attachment uploaded successfully')

            onSuccess?.()
        },

        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Failed to upload attachment'

            toast.error(errorMessage)

            onError?.(error)
        },
    })
}