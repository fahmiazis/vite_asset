import { axiosPrivate } from "../../libs/instance";
import type { roleListProps } from "../../models/roles/list";
export const roleList = async (): Promise<roleListProps> => {
  const res = await axiosPrivate.get(`/api/v1/roles`)

  if (!res) {
    throw new Error('fail to get list role')
  }

  const data = await res.data
  return data
}