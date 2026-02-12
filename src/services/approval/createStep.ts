import { axiosPrivate } from "../../libs/instance"
import type { CreateFlowStepRequest, CreateFlowStepResponse } from "../../models/approval/createStep"

export const createApprovalStep = {
  create: async (data: CreateFlowStepRequest): Promise<CreateFlowStepResponse> => {
    const response = await axiosPrivate.post('/approval-flow-steps', data)
    return response.data
  },
}