import { axiosPrivate } from "../../libs/instance"
import type {
  HandoverAttachmentConfig,
  HandoverAttachmentStatus,
  HandoverDetailProps,
  HandoverEligibleAsset,
  HandoverListProps,
  HandoverRecipient,
} from "../../models/handover"
import type { HandoverType } from "../../constans/handover"
import type { approvalStatusProps } from "../../models/transaction/approvalStatus"

const BASE = "/transactions/handover"
// nomor transaksi mengandung "/" dan spasi — selalu lewat query param
const byNumber = (transactionNumber: string) => ({ params: { transaction_number: transactionNumber } })

export interface HandoverListParams {
  page: number
  limit: number
  current_stage?: string
  handover_type?: HandoverType | ""
  search?: string
  start_date?: string
  end_date?: string
  waiting_for_me?: boolean
}

export const handoverList = async (params: HandoverListParams): Promise<HandoverListProps> => {
  const res = await axiosPrivate.get(BASE, {
    params: {
      ...params,
      current_stage: params.current_stage || undefined,
      handover_type: params.handover_type || undefined,
      search: params.search || undefined,
      waiting_for_me: params.waiting_for_me || undefined,
    },
  })
  return res.data
}

export const handoverDetail = async (transactionNumber: string): Promise<HandoverDetailProps> => {
  const res = await axiosPrivate.get(`${BASE}/detail`, byNumber(transactionNumber))
  return res.data
}

export const handoverEligibleAssets = async (
  handoverType: HandoverType,
  search: string,
  excludeTransactionNumber?: string
): Promise<HandoverEligibleAsset[]> => {
  const res = await axiosPrivate.get(`${BASE}/eligible-assets`, {
    params: {
      handover_type: handoverType,
      search: search || undefined,
      exclude_transaction_number: excludeTransactionNumber || undefined,
    },
  })
  return res.data.data
}

export const handoverRecipients = async (): Promise<HandoverRecipient[]> => {
  const res = await axiosPrivate.get(`${BASE}/recipients`)
  return res.data.data
}

export interface CreateHandoverPayload {
  handover_type: HandoverType
  to_user_id?: string
  transaction_date?: string
  notes?: string
  asset_ids: number[]
}

export const createHandover = async (payload: CreateHandoverPayload): Promise<HandoverDetailProps> => {
  const res = await axiosPrivate.post(BASE, payload)
  return res.data
}

export interface UpdateHandoverPayload {
  to_user_id?: string
  notes?: string
  asset_ids: number[]
}

export const updateHandoverDraft = async (
  transactionNumber: string,
  payload: UpdateHandoverPayload
): Promise<HandoverDetailProps> => {
  const res = await axiosPrivate.put(`${BASE}/draft/update`, payload, byNumber(transactionNumber))
  return res.data
}

export const submitHandover = async (transactionNumber: string, notes?: string) => {
  const res = await axiosPrivate.post(`${BASE}/draft/submit`, { notes }, byNumber(transactionNumber))
  return res.data
}

export const handoverApprovalStatus = async (transactionNumber: string): Promise<approvalStatusProps> => {
  const res = await axiosPrivate.get(`${BASE}/approval/status`, byNumber(transactionNumber))
  return res.data
}

export const reviseHandover = async (
  transactionNumber: string,
  payload: { revision_notes: string; row_ids: number[] }
) => {
  const res = await axiosPrivate.post(`${BASE}/approval/revise`, payload, byNumber(transactionNumber))
  return res.data
}

export const cancelHandover = async (transactionNumber: string, reason: string) => {
  const res = await axiosPrivate.post(`${BASE}/cancel`, { reason }, byNumber(transactionNumber))
  return res.data
}

export const confirmHandoverReceiving = async (transactionNumber: string, notes?: string) => {
  const res = await axiosPrivate.post(`${BASE}/confirm-receiving`, { notes }, byNumber(transactionNumber))
  return res.data
}

export const rejectHandoverReceiving = async (transactionNumber: string, reason: string) => {
  const res = await axiosPrivate.post(`${BASE}/reject-receiving`, { reason }, byNumber(transactionNumber))
  return res.data
}

// ── Dokumen (attachment generik, transaction_type=handover) ──────────────────

export const handoverAttachmentStatus = async (
  transactionNumber: string,
  stage: string,
  branchCode: string
): Promise<HandoverAttachmentStatus> => {
  const res = await axiosPrivate.get(`/attachments/status`, {
    params: { transaction_number: transactionNumber, transaction_type: "handover", stage, branch_code: branchCode },
  })
  return res.data.data
}

export const handoverAttachmentConfigs = async (stage: string, branchCode: string): Promise<HandoverAttachmentConfig[]> => {
  const res = await axiosPrivate.get(`/attachment-configs`, {
    params: { transaction_type: "handover", stage, branch_code: branchCode },
  })
  return res.data.data
}

export const handoverAttachmentFile = async (attachmentId: number): Promise<Blob> => {
  const res = await axiosPrivate.get(`/attachments/${attachmentId}/file`, { responseType: "blob" })
  return res.data
}
