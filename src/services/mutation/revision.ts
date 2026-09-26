import { axiosPrivate } from "../../libs/instance"
import type {
  CancelTransactionPayload,
  ReturnForRevisionPayload,
} from "../transaction/revision"

const post = <T>(path: string, transactionNumber: string, payload: T) =>
  axiosPrivate
    .post(`/transactions/mutation${path}`, payload, {
      params: { transaction_number: transactionNumber },
    })
    .then((res) => res.data)

/** APPROVAL → DRAFT, diminta approver step berjalan */
export const returnMutationForRevision = (
  transactionNumber: string,
  payload: ReturnForRevisionPayload
) => post("/approval/revise", transactionNumber, payload)

/** dibatalkan pengaju sendiri */
export const cancelMutation = (
  transactionNumber: string,
  payload: CancelTransactionPayload
) => post("/cancel", transactionNumber, payload)
