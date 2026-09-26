import type { HandoverType } from "../constans/handover"

export interface HandoverTransactionHeader {
  id: number
  transaction_number: string
  transaction_type: string
  transaction_date: string
  current_stage: string
  status: string
  notes: string | null
  created_by: string
  created_by_name: string | null
  needs_revision: boolean
  created_at: string
  updated_at: string
}

export interface HandoverAsset {
  id: number
  asset_id: number
  asset_number: string
  asset_name: string
  category_name?: string | null
  branch_code: string | null
  from_user_id: string | null
  from_user_name?: string | null
  previous_asset_status: string
  status: "PENDING" | "COMPLETED" | "CANCELLED"
  needs_revision: boolean
  revision_notes: string | null
}

export interface HandoverStage {
  id: number
  from_stage: string | null
  to_stage: string
  action: string
  actor_id: string
  actor_name: string | null
  notes: string | null
  created_at: string
}

export interface HandoverDetail {
  transaction: HandoverTransactionHeader
  handover_type: HandoverType
  to_user_id: string | null
  to_user_name?: string | null
  branch_code: string
  assets: HandoverAsset[]
  stages: HandoverStage[]
  total_assets: number
  needs_revision: boolean
  waiting_for_me: boolean
  can_confirm_receiving: boolean
}

export interface HandoverDetailProps {
  data: HandoverDetail
  message: string
  status: string
}

export interface HandoverListItem {
  transaction_number: string
  transaction_date: string
  current_stage: string
  status: string
  handover_type: HandoverType
  to_user_name?: string | null
  created_by: string
  created_by_name?: string | null
  branch_code: string
  total_assets: number
  needs_revision: boolean
  created_at: string
}

export interface HandoverListProps {
  data: { data: HandoverListItem[]; total: number; page: number; limit: number }
  message: string
  status: string
}

export interface HandoverEligibleAsset {
  asset_id: number
  asset_number: string
  asset_name: string
  category_name?: string | null
  asset_status: string
  location: string | null
  assigned_user_id: string | null
  assigned_user_name?: string | null
}

export interface HandoverRecipient {
  user_id: string
  fullname: string
  username: string
  email: string
}

/** GET /attachments/status — dto.AttachmentStatusSummary */
export interface HandoverAttachmentConfig {
  id: number
  attachment_type: string
  description: string | null
  is_required: boolean
}

export interface HandoverAttachment {
  id: number
  attachment_config_id: number
  attachment_type?: string
  file_name: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  uploaded_at: string
  rejection_reason: string | null
}

export interface HandoverAttachmentStatus {
  total_required: number
  missing_required: HandoverAttachmentConfig[]
  attachments: HandoverAttachment[]
}
