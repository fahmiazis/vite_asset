import { axiosPrivate } from "../../libs/instance";
import type { detailDepreProps } from "../../models/depreciation/detail";

export const depreDetail = async (id: string): Promise<detailDepreProps> => {
  const res = await axiosPrivate.get(`/depreciation-settings/${id}`)

  if (!res) {
    throw new Error('fail to get detail depreciation')
  }

  const data = await res.data
  return data
}