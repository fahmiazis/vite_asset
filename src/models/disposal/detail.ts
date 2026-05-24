export interface disposalDetailProps {
  data: disposalDetailState
  message: string
  status: string
}

export interface disposalDetailState {
  transaction: Transaction
  assets: any[]
  stages: any[]
}

export interface Transaction {
  id: number
  transaction_number: string
  transaction_type: string
  transaction_date: string
  status: string
  current_stage: string
  disposal_type: string
  sale_value: any
  approval_request_number: any
  approval_agreement_number: any
  notes: string
  created_by: string
  created_at: string
  updated_at: string
}
