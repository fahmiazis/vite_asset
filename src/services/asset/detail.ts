import { axiosPrivate } from "../../libs/instance";
import type { detailAssetsProps } from "../../models/asset/detail";

export const assetDetail = async (id: string): Promise<detailAssetsProps> => {
  const res = await axiosPrivate.get(`/assets/${id}`)

  if (!res) {
    throw new Error('fail to get detail assets')
  }

  const data = await res.data
  return data
}