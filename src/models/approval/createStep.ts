export interface CreateFlowStepRequest {
  flow_id: string
  step_order: number
  step_name: string
  step_role: string
  role_id: string
  structure: string
  isRequired: boolean
  is_visible: boolean
  type: string
  category: string
  approval_way: string
}

export interface CreateFlowStepResponse {
  data: any
  message: string
  status: string
}