import { axiosPrivate } from "../../libs/instance"

export interface ExecuteMutationPayload {
  notes: string
}

export const executeMutation = async (
  transactionNumber: string,
  payload: ExecuteMutationPayload
) => {
  const res = await axiosPrivate.post(
    `/transactions/mutation/execute`,
    payload,
    {
      params: {
        transaction_number: transactionNumber,
      },
    }
  )

  if (!res) {
    throw new Error("fail to execute mutation")
  }

  return res.data
}