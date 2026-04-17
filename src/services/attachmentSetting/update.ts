import { axiosPrivate } from "../../libs/instance"

export interface UpdateAttachmentSettingPayload {
  description: string
  is_required: boolean
  is_active: boolean
}

export const updateAttachmentSetting = async (
  id: number,
  payload: UpdateAttachmentSettingPayload
) => {
  const res = await axiosPrivate.put(
    `/attachment-configs/${id}`,
    payload
  )

  if (!res) {
    throw new Error("fail to update attachment setting")
  }

  return res.data
}