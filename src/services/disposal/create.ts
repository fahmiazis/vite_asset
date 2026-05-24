import { axiosPrivate } from "../../libs/instance";
import type { CreateDisposalRequest, CreateDisposalResponse } from "../../models/disposal/create";

export const createDisposal = async (payload: CreateDisposalRequest): Promise<CreateDisposalResponse> => {
    const response = await axiosPrivate.post<CreateDisposalResponse>('/transactions/disposal', payload);
    return response.data;
}