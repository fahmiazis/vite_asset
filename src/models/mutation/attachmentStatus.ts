// ============================================================
// Status dokumen mutasi.
//
// Berbeda dengan disposal, attachment mutasi tidak dipisah per stage —
// satu transaksi punya satu kumpulan dokumen per aset.
// ============================================================

export interface MutationAttachment {
  id: number
  transaction_mutation_asset_id: number
  asset_id: number
  asset_number: string
  attachment_config_id: number
  attachment_type?: string | null
  is_required?: boolean | null
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

export interface MutationAssetAttachmentStatus {
  transaction_number: string
  asset_id: number
  asset_number: string
  can_proceed: boolean
  total_required: number
  total_approved: number
  total_pending: number
  total_rejected: number
  attachments: MutationAttachment[]
}

export interface mutationAttachmentStatusState {
  transaction_number: string
  all_can_proceed: boolean
  assets: MutationAssetAttachmentStatus[]
}

export interface mutationAttachmentStatusProps {
  data: mutationAttachmentStatusState
  message: string
  status: string
}
