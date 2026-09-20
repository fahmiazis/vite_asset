import { axiosPrivate } from "../../libs/instance"
import type { CreateRoleRequest } from "../../models/roles/detail"

export const createRole = async (payload: CreateRoleRequest) => {
  const res = await axiosPrivate.post("/roles", payload)

  if (!res) {
    throw new Error("fail to create role")
  }

  return res.data
}
