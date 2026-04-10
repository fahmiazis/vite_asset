export interface homeBaseListProps {
  data: homeBaseListState[]
  message: string
  status: string
}

export interface homeBaseListState {
  id: string
  user_id: string
  branch_id: string
  branch_type: string
  is_active: boolean
  created_at: string
  branch: Branch
}

export interface Branch {
  id: string
  branch_code: string
  branch_name: string
  branch_type: string
  status: string
}
