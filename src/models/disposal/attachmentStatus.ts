import type { DisposalAttachment } from "./detail"

export interface disposalAttachmentStatusProps {
  data: disposalAttachmentStatusState
  message: string
  status: string
}

export interface disposalAttachmentStatusState {
  transaction_number: string
  stage: string
  all_can_proceed: boolean
  assets: DisposalAssetAttachmentStatus[]
}

export interface DisposalAssetAttachmentStatus {
  asset_id: number
  asset_number: string
  stage: string
  can_proceed: boolean
  total_required: number
  total_approved: number
  total_pending: number
  total_rejected: number
  attachments: DisposalAttachment[]
}

// ─── Bentuk response versi remote (dipakai hooks/query/disposal/attchmentStatus.ts
//     dan services/disposal/statusAttachment.ts) ────────────────────────────

export interface AttachDisposalStatusProps {
  data: AttachDisposalStatusState
  message: string
  status: string
}

export interface AttachDisposalStatusState {
  transaction_number: string
  stage: string
  all_can_proceed: boolean
  assets: Asset[]
}

export interface Asset {
  asset_id: number
  asset_number: string
  stage: string
  can_proceed: boolean
  total_required: number
  total_approved: number
  total_pending: number
  total_rejected: number
  attachments: Attachment[]
}

export interface Attachment {
  id: number
  transaction_disposal_asset_id: number
  asset_id: number
  asset_number: string
  attachment_config_id: number
  attachment_type: string
  is_required: boolean
  stage: string
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
