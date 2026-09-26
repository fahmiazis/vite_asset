import {
  cancelProcurement,
  returnProcurementForRevision,
  type CancelTransactionPayload,
  type ReturnForRevisionPayload,
} from "../../../services/transaction/revision"
import { createRevisionActionHook } from "../common/revision"

export const useReturnProcurementForRevision =
  createRevisionActionHook<ReturnForRevisionPayload>(
    returnProcurementForRevision,
    "Pengajuan dikembalikan untuk revisi",
    "Gagal mengembalikan pengajuan"
  )

export const useCancelProcurement = createRevisionActionHook<CancelTransactionPayload>(
  cancelProcurement,
  "Pengajuan dibatalkan",
  "Gagal membatalkan pengajuan"
)
