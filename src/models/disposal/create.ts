export interface CreateDisposalRequest {
  transaction_date: string
  disposal_type: string
  notes?: string
}

export interface CreateDisposalResponse {
  data: {
    transaction_number: string
    status: string
  }
  message: string
  status: string
}