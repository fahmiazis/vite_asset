import { axiosPrivate } from "../../libs/instance";
import type { attachmentSettingProps } from "../../models/attachmentSetting/list";

export const AttachmentSettingList = async (type: string, stage?: string): Promise<attachmentSettingProps> => {
  // stage opsional — tanpa stage (mis. procurement) jangan kirim "undefined",
  // backend akan mencocokkannya sebagai nama stage dan hasilnya kosong
  const res = await axiosPrivate.get(`attachment-configs`, {
    params: { transaction_type: type, stage: stage || undefined },
  })

  if (!res) {
    throw new Error('fail to get list assets')
  }

  const data = await res.data
  return data
}

// https://dev-ofr.pinusmerahabadi.co.id/rebuild/api/v1/attachment-configs?transaction_type=procurement