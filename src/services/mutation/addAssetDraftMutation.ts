import { axiosPrivate } from "../../libs/instance"

export interface AddAssetDraftMutationPayload {
  asset_id: number
  asset_number: string
  from_location: string
  to_location: string
  notes: string
}

export const addAssetDraftMutation = async (
  transactionNumber: string,
  payload: AddAssetDraftMutationPayload
) => {
  const res = await axiosPrivate.post(
    `/transactions/mutation/draft/add-asset`,
    payload,
    {
      params: {
        transaction_number: transactionNumber,
      },
    }
  )

  if (!res) {
    throw new Error("fail to add asset to draft mutation")
  }

  return res.data
}