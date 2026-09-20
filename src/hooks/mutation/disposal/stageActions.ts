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
  setDisposalSaleValues,
  type DisposalNotesPayload,
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

      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["disposal-detail", transactionNumber] })
        queryClient.invalidateQueries({ queryKey: ["disposal-approval-status", transactionNumber] })
        queryClient.invalidateQueries({ queryKey: ["disposal-attachment-status", transactionNumber] })
        queryClient.invalidateQueries({ queryKey: ["disposal-list"] })

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
