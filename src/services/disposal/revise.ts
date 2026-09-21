import { axiosPrivate } from "../../libs/instance"

/**
 * Approver step berjalan mengembalikan transaksi ke DRAFT.
 *
 * Backend: POST /transactions/disposal/revise (services.ReviseDisposal).
 * Berbeda dengan reject yang terminal, revisi menyisakan draft-nya utuh —
 * aset tetap menempel dan dokumen yang sudah diupload tidak dihapus.
 */
export interface ReviseDisposalRequest {
  revision_notes: string
  /** id baris transaction_disposal_assets yang perlu diperbaiki, minimal satu */
  disposal_asset_ids: number[]
}

export const reviseDisposal = async (
  transactionNumber: string,
  payload: ReviseDisposalRequest
) => {
  const response = await axiosPrivate.post(
    `/transactions/disposal/revise`,
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return response.data
}
