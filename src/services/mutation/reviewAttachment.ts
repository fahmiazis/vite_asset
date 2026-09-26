import { axiosPrivate } from "../../libs/instance"

export interface ReviewMutationAttachmentPayload {
  status: "APPROVED" | "REJECTED"
  rejection_reason?: string
}

export const reviewMutationAttachment = async (
  id: number,
  payload: ReviewMutationAttachmentPayload
) => {
  const res = await axiosPrivate.put(
    `/transactions/mutation/attachments/${id}/review`,
    payload
  )

  if (!res) {
    throw new Error("fail to review mutation attachment")
  }

  return res.data
}
