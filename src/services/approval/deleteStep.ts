import { axiosPrivate } from "../../libs/instance"

export const deleteApprovalStep = async (stepId: string) => {
  const response = await axiosPrivate.delete(`/approval-flow-steps/${stepId}`)
  return response.data
}
