// services/transaction/mutation/submitDraftMutation.ts
import { axiosPrivate } from "../../libs/instance"

export interface SubmitDraftMutationPayload {
  notes: string
}

export const submitDraftMutation = async (
  transactionNumber: string,
  payload: SubmitDraftMutationPayload
) => {
  const res = await axiosPrivate.post(
    `/transactions/mutation/draft/submit`,
    payload,
    {
      params: {
        transaction_number: transactionNumber,
      },
    }
  )

  if (!res) {
    throw new Error("fail to submit draft mutation")
  }

  return res.data
}