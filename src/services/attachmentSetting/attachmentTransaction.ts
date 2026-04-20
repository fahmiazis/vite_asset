import { axiosPrivate } from "../../libs/instance";
import type { transactionAttachmentProps } from "../../models/attachmentSetting/transactionAttachment";

export const attachTransaction = async (id: string): Promise<transactionAttachmentProps> => {
  const res = await axiosPrivate.get(`/attachments?transaction_number=${id}&transaction_type=procurement`)

  if (!res) {
    throw new Error('fail to get detail attachment transaction')
  }

  const data = await res.data
  return data
}