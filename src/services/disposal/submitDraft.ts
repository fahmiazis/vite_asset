import { axiosPrivate } from "../../libs/instance";

export interface SubmitDisposalRequest {
  notes?: string;
}

export interface SubmitDisposalResponse {
  message: string;
}

export const submitDisposal = async (
  transactionNumber: string,
  payload: SubmitDisposalRequest
): Promise<SubmitDisposalResponse> => {
  const response = await axiosPrivate.post<SubmitDisposalResponse>(
    `/transactions/disposal/draft/submit`,
    payload,
    {
      params: { transaction_number: transactionNumber },
    }
  );
  return response.data;
};