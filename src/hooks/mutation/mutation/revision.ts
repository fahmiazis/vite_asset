import type {
  CancelTransactionPayload,
  ReturnForRevisionPayload,
} from "../../../services/transaction/revision"
import {
  cancelMutation,
  returnMutationForRevision,
} from "../../../services/mutation/revision"
import { createRevisionActionHook } from "../common/revision"

export const useReturnMutationForRevision =
  createRevisionActionHook<ReturnForRevisionPayload>(
    returnMutationForRevision,
    "Pengajuan dikembalikan untuk revisi",
    "Gagal mengembalikan pengajuan"
  )

export const useCancelMutation = createRevisionActionHook<CancelTransactionPayload>(
  cancelMutation,
  "Pengajuan dibatalkan",
  "Gagal membatalkan pengajuan"
)
