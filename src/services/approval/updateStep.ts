import { axiosPrivate } from "../../libs/instance"
import type { UpdateFlowStepRequest, UpdateFlowStepResponse } from "../../models/approval/updateStep"

export const updateApprovalStep = async (
  stepId: string,
  data: UpdateFlowStepRequest
): Promise<UpdateFlowStepResponse> => {
  const response = await axiosPrivate.put(`/approval-flow-steps/${stepId}`, data)
  return response.data
}
