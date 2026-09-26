/** Dua jenis keanggotaan cabang, dibedakan oleh branch_type di user_branchs */
export type BranchMemberVariant = "homebase" | "assignment"

export interface branchMembersProps {
  data: BranchMemberState[]
  message: string
  status: string
}

export interface BranchMemberState {
  id: string
  username: string
  fullname: string
  email: string
  status: string
  /** hanya untuk varian homebase — apakah ini homebase aktif user tersebut */
  is_active?: boolean
  /** hanya untuk varian assignment — 'assignment' atau 'temporary' */
  branch_type?: string
}

export interface AssignBranchMembersRequest {
  user_ids: string[]
}
