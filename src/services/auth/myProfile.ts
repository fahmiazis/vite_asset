import { axiosPrivate } from "../../libs/instance";
import type { myProfileProps } from "../../models/auth/myProfile";
export const myProfile = async (): Promise<myProfileProps> => {
  const res = await axiosPrivate.get(`/auth/me`)

  if (!res) {
    throw new Error('fail to get my profile')
  }

  const data = await res.data
  return data
}