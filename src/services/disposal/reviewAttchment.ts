import { axiosPrivate } from "../../libs/instance"

export interface ReviewDisposalAttachmentResponse {
    data: any
    message: string
    status: string
}

export interface ReviewDisposalAttachmentParams {
    id: string | number
}

export type DisposalAttachmentReviewStatus = "APPROVED" | "REJECTED"

export interface ReviewDisposalAttachmentPayload {
    status: DisposalAttachmentReviewStatus
    rejection_reason: string | null
}

export const reviewDisposalAttachment = async (
    params: ReviewDisposalAttachmentParams,
    payload: ReviewDisposalAttachmentPayload
): Promise<ReviewDisposalAttachmentResponse> => {
    const response = await axiosPrivate.put<ReviewDisposalAttachmentResponse>(
        `/transactions/disposal/attachments/${params.id}/review`,
        payload
    )

    return response.data
}