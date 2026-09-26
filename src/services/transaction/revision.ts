import { axiosPrivate } from "../../libs/instance"

export interface ReturnForRevisionPayload {
  /** backend memvalidasi minimal 10 karakter */
  revision_notes: string
  /** ID baris item yang ditandai perlu diperbaiki */
  row_ids: number[]
}

export interface CancelTransactionPayload {
  /** backend memvalidasi minimal 10 karakter */
  reason: string
}

const post = <T>(path: string, transactionNumber: string, payload: T) =>
  axiosPrivate
    .post(`/transactions/procurement${path}`, payload, {
      params: { transaction_number: transactionNumber },
    })
    .then((res) => res.data)

/** APPROVAL → DRAFT, diminta approver step berjalan */
export const returnProcurementForRevision = (
  transactionNumber: string,
  payload: ReturnForRevisionPayload
) => post("/approval/revise", transactionNumber, payload)

/** dibatalkan pengaju sendiri */
export const cancelProcurement = (
  transactionNumber: string,
  payload: CancelTransactionPayload
) => post("/cancel", transactionNumber, payload)
