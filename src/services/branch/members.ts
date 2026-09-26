import { axiosPrivate } from "../../libs/instance"
import type {
  AssignBranchMembersRequest,
  BranchMemberVariant,
  branchMembersProps,
} from "../../models/branch/members"

/** Segment URL per varian keanggotaan */
const PATH: Record<BranchMemberVariant, string> = {
  homebase: "homebase-users",
  assignment: "assigned-users",
}

/** GET /branchs/:id/{homebase-users|assigned-users} */
export const branchMembers = async (
  branchId: string,
  variant: BranchMemberVariant
): Promise<branchMembersProps> => {
  const res = await axiosPrivate.get(`/branchs/${branchId}/${PATH[variant]}`)

  if (!res) {
    throw new Error("fail to get branch members")
  }

  return res.data
}

/** POST /branchs/:id/{homebase-users|assigned-users} */
export const assignBranchMembers = async (
  branchId: string,
  variant: BranchMemberVariant,
  payload: AssignBranchMembersRequest
): Promise<branchMembersProps> => {
  const res = await axiosPrivate.post(
    `/branchs/${branchId}/${PATH[variant]}`,
    payload
  )

  if (!res) {
    throw new Error("fail to assign branch members")
  }

  return res.data
}

/** DELETE /branchs/:id/{homebase-users|assigned-users}/:user_id */
export const removeBranchMember = async (
  branchId: string,
  variant: BranchMemberVariant,
  userId: string
) => {
  const res = await axiosPrivate.delete(
    `/branchs/${branchId}/${PATH[variant]}/${userId}`
  )

  if (!res) {
    throw new Error("fail to remove branch member")
  }

  return res.data
}
