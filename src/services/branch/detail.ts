import { axiosPrivate } from "../../libs/instance";
import type { detailBranchProps } from "../../models/branch/detail";
export const branchDetail = async (id: string): Promise<detailBranchProps> => {
  const res = await axiosPrivate.get(`/api/v1/branchs/${id}`)

  if (!res) {
    throw new Error('fail to get detail branch')
  }

  const data = await res.data
  return data
}