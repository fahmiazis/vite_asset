export interface attachmentSettingProps {
  data: attachmentSettingState[]
  message: string
  status: string
}

export interface attachmentSettingState {
  id: number
  transaction_type: string
  stage: string
  branch_code: string
  attachment_type: string
  description: string
  is_required: boolean
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}
