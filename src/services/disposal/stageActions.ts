import { axiosPrivate } from "../../libs/instance"

// ============================================================
// Aksi transisi stage disposal.
// Semua endpoint memakai query param `transaction_number`.
// ============================================================

export interface DisposalNotesPayload {
  notes?: string
}

export interface DisposalAssetSaleValue {
  /** ID baris transaction_disposal_assets */
  disposal_asset_id: number
  sale_value: number
}

export interface SetDisposalSaleValuesPayload {
  assets: DisposalAssetSaleValue[]
  notes?: string
}

export interface RejectDisposalPayload {
  /** backend memvalidasi minimal 10 karakter */
  reason: string
}

const post = async <T>(path: string, transactionNumber: string, payload: T) => {
  const res = await axiosPrivate.post(`/transactions/disposal${path}`, payload ?? {}, {
    params: { transaction_number: transactionNumber },
  })
  return res.data
}

/** PURCHASING → APPROVAL_REQUEST (SELL only) */
export const setDisposalSaleValues = (
  transactionNumber: string,
  payload: SetDisposalSaleValuesPayload
) => post("/purchasing/set-sale-values", transactionNumber, payload)

/** Mulai flow approval request */
export const initiateDisposalApprovalRequest = (
  transactionNumber: string,
  metadata?: Record<string, unknown>
) => post("/approval-request/initiate", transactionNumber, { metadata })

/** Mulai flow approval agreement */
export const initiateDisposalApprovalAgreement = (
  transactionNumber: string,
  metadata?: Record<string, unknown>
) => post("/approval-agreement/initiate", transactionNumber, { metadata })

/** EXECUTE → FINANCE (SELL) / ASSET_DELETION (DISPOSE) */
export const executeDisposal = (
  transactionNumber: string,
  payload: DisposalNotesPayload
) => post("/execute", transactionNumber, payload)

/** FINANCE → TAX (SELL only) */
export const confirmDisposalFinance = (
  transactionNumber: string,
  payload: DisposalNotesPayload
) => post("/finance/confirm", transactionNumber, payload)

/** TAX → ASSET_DELETION (SELL only) */
export const confirmDisposalTax = (
  transactionNumber: string,
  payload: DisposalNotesPayload
) => post("/tax/confirm", transactionNumber, payload)

/** ASSET_DELETION → FINISHED, sekaligus generate document_number */
export const confirmDisposalAssetDeletion = (
  transactionNumber: string,
  payload: DisposalNotesPayload
) => post("/asset-deletion/confirm", transactionNumber, payload)

/** Reject dari stage mana pun kecuali DRAFT / FINISHED / REJECTED */
export const rejectDisposal = (
  transactionNumber: string,
  payload: RejectDisposalPayload
) => post("/reject", transactionNumber, payload)
