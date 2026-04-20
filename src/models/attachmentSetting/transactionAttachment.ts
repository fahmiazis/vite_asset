export interface transactionAttachmentProps {
  data: transactionAttachmentState[]
  message: string
  status: string
}

export interface transactionAttachmentState {
  id: number
  transaction_id: number
  transaction_number: string
  transaction_type: string
  stage: string
  attachment_config_id: number
  attachment_type: string
  is_required: boolean
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  status: string
  uploaded_by: string
  uploaded_at: string
  reviewed_by: any
  reviewed_at: any
  rejection_reason: any
  created_at: string
}
