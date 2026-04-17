import { axiosPrivate } from "../../libs/instance"

export interface CreateAttachmentSettingPayload {
  transaction_type: string
  stage: string
  branch_code: string
  attachment_type: string
  description: string
  is_required: boolean
  is_active: boolean
}

export const createAttachmentSetting = async (
  payload: CreateAttachmentSettingPayload
) => {
  const res = await axiosPrivate.post(
    `/attachment-configs`,
    payload
  )

  if (!res) {
    throw new Error("fail to create attachment setting")
  }

  return res.data
}