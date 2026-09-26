import { axiosPrivate } from "../../libs/instance"

/**
 * Aksi per-step approval. Endpoint-nya generik untuk semua jenis transaksi
 * (procurement, mutation, disposal) — yang dikirim adalah id baris
 * transaction_approvals, bukan nomor transaksi.
 *
 * Backend: POST /transaction-approvals/approve dan /reject
 * (routes/approval_routes.go — tidak pakai RequirePermission, otorisasinya
 * dari role approver pada baris approval itu sendiri).
 */
export interface TransactionApprovalActionPayload {
  transaction_approval_id: string
  notes?: string
}

export const approveTransactionApprovalStep = async (
  payload: TransactionApprovalActionPayload
) => {
  const res = await axiosPrivate.post(`/transaction-approvals/approve`, payload)
  return res.data
}

export const rejectTransactionApprovalStep = async (
  payload: TransactionApprovalActionPayload
) => {
  const res = await axiosPrivate.post(`/transaction-approvals/reject`, payload)
  return res.data
}
