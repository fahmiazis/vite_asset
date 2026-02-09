export interface detailBranchProps {
  data: detailBranchState
  message: string
  status: string
}

export interface detailBranchState {
  id: string
  branch_code: string
  branch_name: string
  branch_type: string
  status: string
  created_at: string
  updated_at: string
}
