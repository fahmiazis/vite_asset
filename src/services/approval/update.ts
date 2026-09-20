import { axiosPrivate } from "../../libs/instance"
import type {
  UpdateApprovalFlowRequest,
  UpdateApprovalFlowResponse,
} from "../../models/approval/update"

export const updateApprovalFlow = async (
  id: string,
  data: UpdateApprovalFlowRequest
): Promise<UpdateApprovalFlowResponse> => {
  const response = await axiosPrivate.put(`/approval-flows/${id}`, data)
  return response.data
}
