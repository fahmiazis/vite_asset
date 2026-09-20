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
