export interface detailTransactionWStageProps {
  data: detailTransactionWStageState
  message: string
  status: string
}

export interface detailTransactionWStageState {
  transaction: Transaction
  items: Item[]
  stages: Stage[]
}

export interface Transaction {
  id: number
  transaction_number: string
  transaction_type: string
  transaction_date: string
  status: string
  current_stage: string
  io_number: any
  notes: string
  created_by: string
  approved_by: any
  approved_at: any
  created_at: string
  updated_at: string
}

export interface Item {
  id: number
  transaction_id: number
  transaction_number: string
  item_name: string
  category_id: number
  category_name: string
  quantity: number
  unit_price: number
  total_price: number
  branch_code: string
  notes: string
  created_at: string
  updated_at: string
  details: Detail[]
}

export interface Detail {
  id: number
  transaction_procurement_id: number
  branch_code: string
  quantity: number
  requester_name: string
  notes: string
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
  notes: string
  created_at: string
}
