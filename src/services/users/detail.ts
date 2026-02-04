import { axiosPrivate } from "../../libs/instance";
import type { DetailUserProps } from "../../models/users/detail";
export const userDetail = async (id: string): Promise<DetailUserProps> => {
  const res = await axiosPrivate.get(`/api/v1/users/${id}`)

  if (!res) {
    throw new Error('fail to get detail user')
  }

  const data = await res.data
  return data
}