import { axiosPrivate } from "../../libs/instance"

/**
 * Dokumen transaksi lewat attachment GENERIK (/attachments, /attachment-configs)
 * — dipakai procurement (dan handover). Disposal & mutasi punya endpoint
 * sendiri karena dokumennya per aset.
 */

export interface TransactionDocumentConfig {
  id: number
  attachment_type: string
  description: string | null
  is_required: boolean
}

export interface TransactionDocument {
  id: number
  attachment_config_id: number
  attachment_type?: string
  file_name: string
  file_size?: number | null
  mime_type?: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  uploaded_by: string
  uploaded_at: string
  rejection_reason: string | null
}

export interface TransactionDocumentStatus {
  total_required: number
  total_approved: number
  total_pending: number
  total_rejected: number
  missing_required: TransactionDocumentConfig[]
  attachments: TransactionDocument[]
}

export interface TransactionDocumentsParams {
  transactionNumber: string
  transactionType: string
  stage: string
  /** cabang pengajuan — menentukan config mana yang berlaku */
  branchCode: string
}

export const transactionDocumentConfigs = async (
  p: Omit<TransactionDocumentsParams, "transactionNumber">
): Promise<TransactionDocumentConfig[]> => {
  const res = await axiosPrivate.get(`/attachment-configs`, {
    params: { transaction_type: p.transactionType, stage: p.stage, branch_code: p.branchCode },
  })
  return res.data.data ?? []
}

export const transactionDocumentStatus = async (
  p: TransactionDocumentsParams
): Promise<TransactionDocumentStatus> => {
  const res = await axiosPrivate.get(`/attachments/status`, {
    params: {
      transaction_number: p.transactionNumber,
      transaction_type: p.transactionType,
      stage: p.stage,
      branch_code: p.branchCode,
    },
  })
  return res.data.data
}

export const transactionDocumentFile = async (attachmentId: number): Promise<Blob> => {
  const res = await axiosPrivate.get(`/attachments/${attachmentId}/file`, { responseType: "blob" })
  return res.data
}
