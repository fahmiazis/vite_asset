import { axiosPrivate } from "../../libs/instance";
import type { listAssestProps } from "../../models/asset/list";
export const assetList = async (): Promise<listAssestProps> => {
  const res = await axiosPrivate.get(`/assets?page=1&limit=100`)

  if (!res) {
    throw new Error('fail to get list assets')
  }

  const data = await res.data
  return data
}