import { useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewAttachment, type ReviewAttachmentPayload } from "../../../services/attachmentSetting/reviewAttachment";

export function useReviewAttachment(transactionId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ReviewAttachmentPayload }) =>
            reviewAttachment(id, payload),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["review-attach-transaction", transactionId] })
        },
    })
}