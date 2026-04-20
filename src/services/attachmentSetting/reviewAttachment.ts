import { axiosPrivate } from "../../libs/instance";

export interface ReviewAttachmentPayload {
    status: "APPROVED" | "REJECTED"
    rejection_reason?: string
}

export const reviewAttachment = async (id: number, payload: ReviewAttachmentPayload) => {
    const res = await axiosPrivate.put(`/attachments/${id}/review`, payload)

    if (!res) {
        throw new Error('fail to review attachment')
    }

    return res.data
}