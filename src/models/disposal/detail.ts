export interface disposalDetailProps {
  data: disposalDetailState
  message: string
  status: string
}

export interface disposalDetailState {
  transaction: Transaction
  assets: DisposalAsset[]
  stages: DisposalStageHistory[]
}

export interface Transaction {
  id: number
  transaction_number: string
  transaction_type: string
  transaction_date: string
  status: string
  current_stage: string
  disposal_type: string
  sale_value: number | null
  approval_request_number: string | null
  approval_agreement_number: string | null
  notes: string | null
  created_by: string
  created_by_name: string | null
  created_at: string
  updated_at: string
}

export interface DisposalAsset {
  id: number
  transaction_id: number
  transaction_number: string
  asset_id: number
  asset_number: string
  asset_name?: string | null
  category_id?: number | null
  category_name?: string | null
  branch_code?: string | null
  disposal_type: string
  disposal_reason: string | null
  sale_value: number | null
  document_number: string | null
  notes: string | null
  status: "PENDING" | "DELETED" | "CANCELLED" | string
  attachments?: DisposalAttachment[]
  created_at: string
  updated_at: string
}

export interface DisposalAttachment {
  id: number
  transaction_disposal_asset_id: number
  asset_id: number
  asset_number: string
  attachment_config_id: number
  attachment_type?: string | null
  is_required?: boolean | null
  stage: string
  file_name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  status: "PENDING" | "APPROVED" | "REJECTED" | string
  uploaded_by: string
  uploaded_at: string
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  created_at: string
}

export interface DisposalStageHistory {
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
