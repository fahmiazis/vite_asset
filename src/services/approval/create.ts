import type { CreateApprovalFlowRequest, CreateApprovalFlowResponse } from '../../models/approval/create'
import { axiosPrivate } from '../../libs/instance'

export const createApprovalFlow = async (
  payload: CreateApprovalFlowRequest
): Promise<CreateApprovalFlowResponse> => {
  const response = await axiosPrivate.post<CreateApprovalFlowResponse>(
    '/approval-flows',
    payload,
    {
      headers: {
        'Content-Type': 'application/json', 
      },
    }
  )
  return response.data
}