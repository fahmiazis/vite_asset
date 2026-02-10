import { axiosPrivate } from "../../libs/instance";
import type { CreateBranchRequest, CreateBranchResponse } from "../../models/branch/create";

export const createBranch = async (payload: CreateBranchRequest): Promise<CreateBranchResponse> => {
  const response = await axiosPrivate.post<CreateBranchResponse>('/branchs', payload);
  return response.data;
};