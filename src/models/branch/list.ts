export interface listBranchProps {
  data: branchListState[]
  message: string
  status: string
}

export interface branchListState {
  id: string
  branch_code: string
  branch_name: string
  branch_type: string
  status: string
  created_at: string
  updated_at: string
}
