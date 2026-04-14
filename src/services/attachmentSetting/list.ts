import { axiosPrivate } from "../../libs/instance";
import type { attachmentSettingProps } from "../../models/attachmentSetting/list";

export const AttachmentSettingList = async (type: string): Promise<attachmentSettingProps> => {
  const res = await axiosPrivate.get(`attachment-configs?transaction_type=${type}`)

  if (!res) {
    throw new Error('fail to get list assets')
  }

  const data = await res.data
  return data
}

// https://dev-ofr.pinusmerahabadi.co.id/rebuild/api/v1/attachment-configs?transaction_type=procurement