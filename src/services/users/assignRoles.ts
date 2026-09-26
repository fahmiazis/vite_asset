import { axiosPrivate } from "../../libs/instance"

export interface AssignRolesRequest {
  role_ids: string[]
}

/** POST /users/:id/roles — set role yang dimiliki user */
export const assignRolesToUser = async (
  userId: string,
  payload: AssignRolesRequest
) => {
  const res = await axiosPrivate.post(`/users/${userId}/roles`, payload)

  if (!res) {
    throw new Error("fail to assign roles to user")
  }

  return res.data
}
