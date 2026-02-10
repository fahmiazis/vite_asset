import { axiosPrivate } from "../../libs/instance";
import type { listBranchProps } from "../../models/branch/list";
export const branchList = async (): Promise<listBranchProps> => {
  const res = await axiosPrivate.get(`/branchs`)

  if (!res) {
    throw new Error('fail to get list branch')
  }

  const data = await res.data
  return data
}