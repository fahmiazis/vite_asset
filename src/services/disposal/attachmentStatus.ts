import { axiosPrivate } from "../../libs/instance"
import type { disposalAttachmentStatusProps } from "../../models/disposal/attachmentStatus"

export const disposalAttachmentStatus = async (
  transactionNumber: string,
  stage: string
): Promise<disposalAttachmentStatusProps> => {
  const res = await axiosPrivate.get("/transactions/disposal/attachments/status", {
    params: { transaction_number: transactionNumber, stage },
  })

  if (!res) {
    throw new Error("fail to get disposal attachment status")
  }

  return res.data
}
