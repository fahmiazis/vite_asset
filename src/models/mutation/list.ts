export interface mutationListProps {
  data: mutationListState
  message: string
  status: string
}

export interface mutationListState {
  data: listMutationDatas[]
  limit: number
  page: number
  total: number
}

export interface listMutationDatas {
  transaction: Transaction
  items: any[]
}

export interface Transaction {
  id: number
  transaction_number: string
  transaction_type: string
  transaction_date: string
  status: string
  notes: string
  created_by: string
  approved_by: any
  approved_at: any
  created_at: string
  updated_at: string
}
