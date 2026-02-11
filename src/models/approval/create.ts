export interface CreateApprovalFlowRequest {
  flow_code: string
  flow_name: string
  approval_way: string
  assignment_type: string
  assigned_user_id: string
  is_customizable: boolean
  allowed_creator_roles: string[]
  description: string
  is_active: boolean
}

export interface CreateApprovalFlowResponse {
  message: string
  data?: any
}