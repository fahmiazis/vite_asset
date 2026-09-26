import { axiosPrivate } from "../../libs/instance"
import type { mutationAttachmentStatusProps } from "../../models/mutation/attachmentStatus"

export const mutationAttachmentStatus = async (
  transactionNumber: string
): Promise<mutationAttachmentStatusProps> => {
  const res = await axiosPrivate.get("/transactions/mutation/attachments/status", {
    params: { transaction_number: transactionNumber },
  })

  if (!res) {
    throw new Error("fail to get mutation attachment status")
  }

  return res.data
}
