import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import {
  approveTransactionApprovalStep,
  rejectTransactionApprovalStep,
  type TransactionApprovalActionPayload,
} from "../../../services/approval/transactionAction"
import { reviseDisposal } from "../../../services/disposal/revise"
import { cancelDisposal } from "../../../services/disposal/cancel"

/**
 * Setelah approve/reject, stage transaksi bisa ikut berpindah (backend
 * menjalankan autoCompleteDisposalApproval* / autoRejectTransaction), jadi
 * detail dan status approval sama-sama perlu di-refetch.
 */
function useInvalidateDisposal(transactionNumber: string) {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ["disposal-detail"] })
    queryClient.invalidateQueries({
      queryKey: ["disposal-approval-status", transactionNumber],
    })
    queryClient.invalidateQueries({
      queryKey: ["disposal-attachment-status", transactionNumber],
    })
  }
}

export function useApproveDisposalStep(transactionNumber: string) {
  const { t } = useTranslation()
  const invalidate = useInvalidateDisposal(transactionNumber)

  return useMutation({
    mutationFn: (payload: TransactionApprovalActionPayload) =>
      approveTransactionApprovalStep(payload),
    onSuccess: (data) => {
      invalidate()
      toast.success(data?.message || t("disposalAction.step.toast.approveSuccess"))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("disposalAction.step.toast.approveError")
      )
    },
  })
}

export function useRejectDisposalStep(transactionNumber: string) {
  const { t } = useTranslation()
  const invalidate = useInvalidateDisposal(transactionNumber)

  return useMutation({
    mutationFn: (payload: TransactionApprovalActionPayload) =>
      rejectTransactionApprovalStep(payload),
    onSuccess: (data) => {
      invalidate()
      toast.success(data?.message || t("disposalAction.step.toast.rejectSuccess"))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("disposalAction.step.toast.rejectError")
      )
    },
  })
}

/**
 * Kembalikan transaksi ke DRAFT. Aksi ini di level transaksi (bukan per step),
 * jadi endpoint-nya beda dengan approve/reject.
 */
export function useReviseDisposal(transactionNumber: string) {
  const { t } = useTranslation()
  const invalidate = useInvalidateDisposal(transactionNumber)

  return useMutation({
    mutationFn: ({
      revisionNotes,
      disposalAssetIds,
    }: {
      revisionNotes: string
      disposalAssetIds: number[]
    }) =>
      reviseDisposal(transactionNumber, {
        revision_notes: revisionNotes,
        disposal_asset_ids: disposalAssetIds,
      }),
    onSuccess: (data) => {
      invalidate()
      toast.success(data?.message || t("disposalAction.step.toast.reviseSuccess"))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("disposalAction.step.toast.reviseError")
      )
    },
  })
}

/**
 * Pembatalan oleh pengaju. Berbeda dengan reject (approver) baik aktor maupun
 * stage akhirnya: CANCELLED, bukan REJECTED.
 */
export function useCancelDisposal(transactionNumber: string) {
  const { t } = useTranslation()
  const invalidate = useInvalidateDisposal(transactionNumber)

  return useMutation({
    mutationFn: (reason: string) => cancelDisposal(transactionNumber, { reason }),
    onSuccess: (data) => {
      invalidate()
      toast.success(data?.message || t("disposalAction.cancelRequest.success"))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("disposalAction.cancelRequest.error")
      )
    },
  })
}
