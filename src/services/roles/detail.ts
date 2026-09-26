import { axiosPrivate } from "../../libs/instance"
import type { roleDetailProps } from "../../models/roles/detail"

export const roleDetail = async (id: string): Promise<roleDetailProps> => {
  const res = await axiosPrivate.get(`/roles/${id}`)

  if (!res) {
    throw new Error("fail to get detail role")
  }

  return res.data
}
