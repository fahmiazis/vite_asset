import { axiosPrivate } from "../../libs/instance"

export const initiateApprovalMutation = async (transactionNumber: string) => {
  const res = await axiosPrivate.post(
    `/transactions/mutation/approval/initiate`,
    {},
    {
      params: {
        transaction_number: transactionNumber,
      },
    }
  )

  if (!res) {
    throw new Error("fail to initiate approval mutation")
  }

  return res.data
}