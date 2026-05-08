export interface detailMutationProps {
  data: detailMutationState
  message: string
  status: string
}

export interface detailMutationState {
  transaction: Transaction
  assets: Asset[]
  stages: Stage[]
}

export interface Transaction {
  id: number
  transaction_number: string
  transaction_type: string
  transaction_date: string
  status: string
  current_stage: string
  category_id: number
  category_name: string
  to_branch_code: string
  notes: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Asset {
  id: number
  transaction_id: number
  transaction_number: string
  asset_id: number
  asset_number: string
  asset_name: string
  category_id: number
  category_name: string
  from_branch_code: string
  to_branch_code: string
  from_location: string
  to_location: string
  document_number: string
  notes: string
  status: string
  created_at: string
  updated_at: string
}

export interface Stage {
  id: number
  transaction_id: number
  transaction_number: string
  from_stage: string
  to_stage: string
  action: string
  actor_id: string
  actor_name: any
  notes?: string
  created_at: string
}
