import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import {
  cancelHandover,
  confirmHandoverReceiving,
  createHandover,
  rejectHandoverReceiving,
  reviseHandover,
  submitHandover,
  updateHandoverDraft,
  type CreateHandoverPayload,
  type UpdateHandoverPayload,
} from "../../services/handover"
import {
  approveTransactionApprovalStep,
  rejectTransactionApprovalStep,
  type TransactionApprovalActionPayload,
} from "../../services/approval/transactionAction"
import { uploadAttachment } from "../../services/transaction/uploadAttachment"

function errorMessage(error: unknown, fallback: string) {
  const e = error as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message || fallback
}

/** refresh semua yang bergantung pada satu ajuan serah terima */
function useInvalidateHandover(transactionNumber?: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["handover-list"] })
    queryClient.invalidateQueries({ queryKey: ["handover-eligible-assets"] })
    queryClient.invalidateQueries({ queryKey: ["asset-list"] })
    if (transactionNumber) {
      queryClient.invalidateQueries({ queryKey: ["handover-detail", transactionNumber] })
      queryClient.invalidateQueries({ queryKey: ["handover-approval-status", transactionNumber] })
      queryClient.invalidateQueries({ queryKey: ["handover-attachments", transactionNumber] })
    }
  }
}

/** mutasi standar: toast sukses/gagal + invalidasi */
function useHandoverAction<TVars, TResult = unknown>(
  transactionNumber: string | undefined,
  fn: (vars: TVars) => Promise<TResult>,
  successKey: string
) {
  const { t } = useTranslation()
  const invalidate = useInvalidateHandover(transactionNumber)
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      invalidate()
      toast.success(t(successKey))
    },
    onError: (error) => toast.error(errorMessage(error, t("handover.toast.error"))),
  })
}

export const useCreateHandover = () =>
  useHandoverAction(undefined, (payload: CreateHandoverPayload) => createHandover(payload), "handover.toast.created")

export const useUpdateHandoverDraft = (transactionNumber: string) =>
  useHandoverAction(transactionNumber, (payload: UpdateHandoverPayload) => updateHandoverDraft(transactionNumber, payload), "handover.toast.updated")

export const useSubmitHandover = (transactionNumber: string) =>
  useHandoverAction(transactionNumber, (notes?: string) => submitHandover(transactionNumber, notes), "handover.toast.submitted")

export const useApproveHandoverStep = (transactionNumber: string) =>
  useHandoverAction(transactionNumber, (payload: TransactionApprovalActionPayload) => approveTransactionApprovalStep(payload), "handover.toast.approved")

export const useRejectHandoverStep = (transactionNumber: string) =>
  useHandoverAction(transactionNumber, (payload: TransactionApprovalActionPayload) => rejectTransactionApprovalStep(payload), "handover.toast.rejected")

export const useReviseHandover = (transactionNumber: string) =>
  useHandoverAction(transactionNumber, (payload: { revision_notes: string; row_ids: number[] }) => reviseHandover(transactionNumber, payload), "handover.toast.revised")

export const useCancelHandover = (transactionNumber: string) =>
  useHandoverAction(transactionNumber, (reason: string) => cancelHandover(transactionNumber, reason), "handover.toast.cancelled")

export const useConfirmHandoverReceiving = (transactionNumber: string) =>
  useHandoverAction(transactionNumber, (notes?: string) => confirmHandoverReceiving(transactionNumber, notes), "handover.toast.received")

export const useRejectHandoverReceiving = (transactionNumber: string) =>
  useHandoverAction(transactionNumber, (reason: string) => rejectHandoverReceiving(transactionNumber, reason), "handover.toast.rejected")

export const useUploadHandoverDocument = (transactionNumber: string, stage: string) =>
  useHandoverAction(
    transactionNumber,
    ({ configId, file }: { configId: number; file: File }) =>
      uploadAttachment(
        { transaction_number: transactionNumber, transaction_type: "handover", stage },
        { attachment_config_id: String(configId), file }
      ),
    "handover.toast.uploaded"
  )
