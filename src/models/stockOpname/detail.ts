export interface StockOpnameTransaction {
  id: number
  transaction_number: string
  transaction_type: string
  transaction_date: string
  status: string
  current_stage: string
  notes: string | null
  created_by: string
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface StockOpnameItem {
  id: number
  transaction_id: number
  transaction_number: string
  asset_id: number
  asset_number: string
  asset_name?: string
  category_name?: string
  branch_code?: string
  found_physical_status: string | null
  found_condition: string | null
  found_asset_status: string | null
  notes: string | null
  system_physical_status?: string | null
  system_condition?: string | null
  system_asset_status?: string
  photo_id?: number | null
  photo_url?: string | null
  photo_captured_at?: string | null
  borrow_document_id?: number | null
  borrow_document_url?: string | null
  borrow_document_file_name?: string | null
  created_at: string
  updated_at: string
}

export interface StockOpnameStage {
  id: number
  transaction_id: number
  transaction_number: string
  from_stage: string | null
  to_stage: string
  action: string
  actor_id: string
  actor_name: string | null
  notes: string | null
  created_at: string
}

export interface StockOpnameDetailState {
  transaction: StockOpnameTransaction
  items: StockOpnameItem[]
  stages: StockOpnameStage[]
}

export interface stockOpnameDetailProps {
  data: StockOpnameDetailState
  message: string
  status: string
}
