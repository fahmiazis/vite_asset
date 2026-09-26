import { axiosPrivate } from "../../libs/instance"

export interface ReviewDisposalAttachmentPayload {
  status: "APPROVED" | "REJECTED"
  rejection_reason?: string
}

export const reviewDisposalAttachment = async (
  id: number,
  payload: ReviewDisposalAttachmentPayload
) => {
  const res = await axiosPrivate.put(
    `/transactions/disposal/attachments/${id}/review`,
    payload
  )

  if (!res) {
    throw new Error("fail to review disposal attachment")
  }

  return res.data
}
