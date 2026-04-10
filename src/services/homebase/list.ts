import { axiosPrivate } from "../../libs/instance";
import type { homeBaseListProps } from "../../models/homebase/list";

export const homebaseList = async (): Promise<homeBaseListProps> => {
  const res = await axiosPrivate.get(`/user/homebases`)

  if (!res) {
    throw new Error('fail to get list homebase')
  }

  const data = await res.data
  return data
}