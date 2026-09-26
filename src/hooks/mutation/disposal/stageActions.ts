import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import {
  confirmDisposalAssetDeletion,
  confirmDisposalFinance,
  confirmDisposalTax,
  executeDisposal,
  initiateDisposalApprovalAgreement,
  initiateDisposalApprovalRequest,
  rejectDisposal,
  setDisposalIncomeValues,
  setDisposalInvoices,
  setDisposalSaleValues,
  type DisposalNotesPayload,
  type SetDisposalIncomeValuesPayload,
  type SetDisposalInvoicesPayload,
  type RejectDisposalPayload,
  type SetDisposalSaleValuesPayload,
} from "../../../services/disposal/stageActions"

interface UseDisposalStageActionParams {
  transactionNumber: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Factory untuk semua aksi transisi stage disposal.
 * Semua aksi meng-invalidate detail + approval status + attachment status,
 * karena satu transisi mengubah ketiganya.
 */
function createStageActionHook<TPayload>(
  action: (transactionNumber: string, payload: TPayload) => Promise<any>,
  successMessage: string,
  errorMessage: string
) {
  return function useStageAction({
    transactionNumber,
    onSuccess,
    onError,
  }: UseDisposalStageActionParams) {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: (payload: TPayload) => action(transactionNumber, payload),

      // Sengaja onSettled, bukan onSuccess: sebagian aksi stage menyimpan
      // perubahan lalu gagal di langkah berikutnya (mis. stage sudah pindah
      // tapi pembentukan approval gagal). Kalau hanya di-refresh saat sukses,
      // halaman tetap menampilkan stage lama dan percobaan ulang pasti ditolak
      // backend dengan pesan yang membingungkan.
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["disposal-detail", transactionNumber] })
        queryClient.invalidateQueries({ queryKey: ["disposal-approval-status", transactionNumber] })
        queryClient.invalidateQueries({ queryKey: ["disposal-attachment-status", transactionNumber] })
        queryClient.invalidateQueries({ queryKey: ["disposal-list"] })
      },

      onSuccess: (data) => {
        toast.success(data?.message || successMessage)
        onSuccess?.()
      },

      onError: (error: any) => {
        const message =
          error.response?.data?.message || error.message || errorMessage
        toast.error(message)
        onError?.(error)
      },
    })
  }
}

export const useSetDisposalSaleValues = createStageActionHook<SetDisposalSaleValuesPayload>(
  setDisposalSaleValues,
  "Nilai jual berhasil disimpan",
  "Gagal menyimpan nilai jual"
)

export const useInitiateDisposalApprovalRequest = createStageActionHook<void>(
  (tn) => initiateDisposalApprovalRequest(tn),
  "Permohonan persetujuan berhasil diajukan",
  "Gagal mengajukan permohonan persetujuan"
)

export const useInitiateDisposalApprovalAgreement = createStageActionHook<void>(
  (tn) => initiateDisposalApprovalAgreement(tn),
  "Persetujuan kesepakatan berhasil diajukan",
  "Gagal mengajukan persetujuan kesepakatan"
)

export const useExecuteDisposal = createStageActionHook<DisposalNotesPayload>(
  executeDisposal,
  "Disposal berhasil dieksekusi",
  "Gagal mengeksekusi disposal"
)

export const useSetDisposalIncomeValues = createStageActionHook<SetDisposalIncomeValuesPayload>(
  setDisposalIncomeValues,
  "Nilai pemasukan berhasil disimpan",
  "Gagal menyimpan nilai pemasukan"
)

export const useSetDisposalInvoices = createStageActionHook<SetDisposalInvoicesPayload>(
  setDisposalInvoices,
  "Data faktur berhasil disimpan",
  "Gagal menyimpan data faktur"
)

export const useConfirmDisposalFinance = createStageActionHook<DisposalNotesPayload>(
  confirmDisposalFinance,
  "Konfirmasi finance berhasil",
  "Gagal konfirmasi finance"
)

export const useConfirmDisposalTax = createStageActionHook<DisposalNotesPayload>(
  confirmDisposalTax,
  "Konfirmasi pajak berhasil",
  "Gagal konfirmasi pajak"
)

export const useConfirmDisposalAssetDeletion = createStageActionHook<DisposalNotesPayload>(
  confirmDisposalAssetDeletion,
  "Penghapusan aset berhasil dikonfirmasi",
  "Gagal mengkonfirmasi penghapusan aset"
)

export const useRejectDisposal = createStageActionHook<RejectDisposalPayload>(
  rejectDisposal,
  "Disposal berhasil ditolak",
  "Gagal menolak disposal"
)
