import { axiosPrivate } from "../../libs/instance";
import type { CreateMutationRequest, CreateMutationResponse } from "../../models/mutation/create";

export const createMutation = async (payload: CreateMutationRequest): Promise<CreateMutationResponse> => {
    const response = await axiosPrivate.post<CreateMutationResponse>('/transactions/mutation', payload);
    return response.data;
}