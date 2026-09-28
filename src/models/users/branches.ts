/** Jenis baris user_branchs — beda dengan branch_type milik cabangnya sendiri */
export type UserBranchMembership = "homebase" | "assignment" | "temporary"

export interface UserBranchesProps {
  data: UserBranchState[]
  message: string
  status: string
}

/** GET /users/:id/branchs — dto.UserBranchMembershipResponse */
export interface UserBranchState {
  id: string
  branch_code: string
  branch_name: string
  branch_type: string
  status: string
  created_at: string
  updated_at: string
  membership_type: UserBranchMembership
  /** hanya bermakna untuk homebase — homebase yang sedang aktif */
  is_active: boolean
}
