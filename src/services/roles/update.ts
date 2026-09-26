import { axiosPrivate } from "../../libs/instance"
import type { UpdateRoleRequest } from "../../models/roles/detail"

export const updateRole = async (id: string, payload: UpdateRoleRequest) => {
  const res = await axiosPrivate.put(`/roles/${id}`, payload)

  if (!res) {
    throw new Error("fail to update role")
  }

  return res.data
}
