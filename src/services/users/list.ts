import { axiosPrivate } from "../../libs/instance";
import type { userListProps } from "../../models/users/list";
export const userList = async (): Promise<userListProps> => {
  const res = await axiosPrivate.get(`/api/v1/users`)

  if (!res) {
    throw new Error('fail to get list user')
  }

  const data = await res.data
  return data
}