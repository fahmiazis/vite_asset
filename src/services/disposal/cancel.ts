import { axiosPrivate } from "../../libs/instance"

/**
 * Pembatalan oleh PENGAJU transaksi — beda dengan reject yang datang dari
 * approver di stage berjalan. Berakhir di stage CANCELLED, bukan REJECTED.
 *
 * Backend: POST /transactions/disposal/cancel (services.CancelDisposal),
 * tanpa permission — yang boleh hanya pembuat transaksinya sendiri.
 */
export interface CancelDisposalRequest {
  reason: string
}

export const cancelDisposal = async (
  transactionNumber: string,
  payload: CancelDisposalRequest
) => {
  const response = await axiosPrivate.post(
    `/transactions/disposal/cancel`,
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return response.data
}
