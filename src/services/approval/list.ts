import { axiosPrivate } from "../../libs/instance";
import type { approvalListProps } from "../../models/approval/list";
export const approvalFlowList = async (): Promise<approvalListProps> => {
  const res = await axiosPrivate.get(`/approval-flows`)

  if (!res) {
    throw new Error('fail to get list approval Flow')
  }

  const data = await res.data
  return data
}