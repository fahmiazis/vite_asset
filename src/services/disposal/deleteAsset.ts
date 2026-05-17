import { axiosPrivate } from "../../libs/instance";

export interface RemoveAssetFromDisposalRequest {
  asset_id: number;
}

export interface RemoveAssetFromDisposalResponse {
  message: string;
}

export const removeAssetFromDisposal = async (
  transactionNumber: string,
  payload: RemoveAssetFromDisposalRequest
): Promise<RemoveAssetFromDisposalResponse> => {
  const response = await axiosPrivate.delete<RemoveAssetFromDisposalResponse>(
    `/transactions/disposal/draft/remove-asset`,
    {
      params: { transaction_number: transactionNumber },
      data: payload,
    }
  );
  return response.data;
};