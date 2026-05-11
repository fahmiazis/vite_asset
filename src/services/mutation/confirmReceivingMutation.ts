import { axiosPrivate } from "../../libs/instance"

export const confirmReceivingMutation = async (transactionNumber: string) => {
  const res = await axiosPrivate.post(
    `/transactions/mutation/confirm-receiving`,
    {},
    {
      params: {
        transaction_number: transactionNumber,
      },
    }
  )

  if (!res) {
    throw new Error("fail to confirm receiving mutation")
  }

  return res.data
}