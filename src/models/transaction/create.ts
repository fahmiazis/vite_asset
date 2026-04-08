export interface ProcurementDetail {
  branch_code: string
  quantity: number
  requester_name: string
  notes: string
}

export interface ProcurementItem {
  item_name: string
  category_id: number
  quantity: number
  unit_price: number
  branch_code: string
  notes: string
  details?: ProcurementDetail[]
}

export interface ProcurementPayload {
  transaction_date: string
  notes: string
  items: ProcurementItem[]
}

export interface ProcurementResponse {
  message: string
  data?: {
    id: string
    transaction_date: string
    status: string
  }
}