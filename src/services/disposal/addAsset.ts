import { axiosPrivate } from "../../libs/instance"
import type { AddAssetToDisposalRequest, AddAssetToDisposalResponse } from "../../models/disposal/addAsset"

export const addAssetToDisposal = async (
  transactionNumber: string,
  payload: AddAssetToDisposalRequest
): Promise<AddAssetToDisposalResponse> => {
  const res = await axiosPrivate.post<AddAssetToDisposalResponse>(
    `/transactions/disposal/draft/add-asset?transaction_number=${encodeURIComponent(transactionNumber)}`,
    payload
  )
  return res.data
}