import { axiosPrivate } from "../../libs/instance"
import type { UserBranchesProps } from "../../models/users/branches"

/** GET /users/:id/branchs — seluruh cabang user beserta jenis keanggotaannya */
export const userBranches = async (userId: string): Promise<UserBranchesProps> => {
  const res = await axiosPrivate.get(`/users/${userId}/branchs`)

  if (!res) {
    throw new Error("fail to get user branches")
  }

  return res.data
}
