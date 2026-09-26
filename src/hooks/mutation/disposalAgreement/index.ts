import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  createDisposalAgreement,
  reviseDisposalAgreement,
  type ReviseDisposalAgreementRequest,
} from "../../../services/disposalAgreement"
import {
  approveTransactionApprovalStep,
  rejectTransactionApprovalStep,
  type TransactionApprovalActionPayload,
} from "../../../services/approval/transactionAction"
import type { CreateDisposalAgreementRequest } from "../../../models/disposalAgreement"

export function useCreateDisposalAgreement() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateDisposalAgreementRequest) =>
      createDisposalAgreement(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["disposal-agreement-list"] })
      queryClient.invalidateQueries({ queryKey: ["disposal-agreement-eligible"] })
      toast.success(data?.message || t("disposalAgreement.toast.created"))
      navigate("/dashboard/disposal-agreement")
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("disposalAgreement.toast.createError")
      )
    },
  })
}

/**
 * Approve/reject step agreement memakai endpoint approval generik — yang
 * membedakan hanya query yang perlu di-refresh setelahnya.
 */
function useInvalidateAgreement(agreementNumber: string) {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ["disposal-agreement-list"] })
    queryClient.invalidateQueries({
      queryKey: ["disposal-agreement-detail", agreementNumber],
    })
    queryClient.invalidateQueries({
      queryKey: ["disposal-agreement-approval-status", agreementNumber],
    })
    // stage transaksi anggotanya ikut berubah saat agreement disetujui
    queryClient.invalidateQueries({ queryKey: ["disposal-detail"] })
  }
}

export function useApproveAgreementStep(agreementNumber: string) {
  const { t } = useTranslation()
  const invalidate = useInvalidateAgreement(agreementNumber)

  return useMutation({
    mutationFn: (payload: TransactionApprovalActionPayload) =>
      approveTransactionApprovalStep(payload),
    onSuccess: (data) => {
      invalidate()
      toast.success(data?.message || t("disposalAgreement.toast.approved"))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("disposalAgreement.toast.approveError")
      )
    },
  })
}

export function useRejectAgreementStep(agreementNumber: string) {
  const { t } = useTranslation()
  const invalidate = useInvalidateAgreement(agreementNumber)

  return useMutation({
    mutationFn: (payload: TransactionApprovalActionPayload) =>
      rejectTransactionApprovalStep(payload),
    onSuccess: (data) => {
      invalidate()
      toast.success(data?.message || t("disposalAgreement.toast.rejected"))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("disposalAgreement.toast.rejectError")
      )
    },
  })
}

/** anggota yang dikeluarkan kembali ke DRAFT — daftar disposal ikut di-refresh */
export function useReviseAgreement(agreementNumber: string) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const invalidate = useInvalidateAgreement(agreementNumber)

  return useMutation({
    mutationFn: (payload: ReviseDisposalAgreementRequest) =>
      reviseDisposalAgreement(agreementNumber, payload),
    onSuccess: (data) => {
      invalidate()
      queryClient.invalidateQueries({ queryKey: ["disposal-agreement-eligible"] })
      queryClient.invalidateQueries({ queryKey: ["disposal-list"] })
      toast.success(data?.message || t("disposalAgreement.toast.revised"))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("disposalAgreement.toast.reviseError")
      )
    },
  })
}
