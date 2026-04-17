import { axiosPrivate } from "../../libs/instance";
import type { attchSettingDetailProps } from "../../models/attachmentSetting/detail";

export const attachSettingDetail = async (id: string): Promise<attchSettingDetailProps> => {
  const res = await axiosPrivate.get(`/attachment-configs/${id}`)

  if (!res) {
    throw new Error('fail to get detail attachment setting')
  }

  const data = await res.data
  return data
}