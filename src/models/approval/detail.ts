export interface detailApprovalFlowProps {
  data: detailApprovalFlowState
  message: string
  status: string
}

export interface detailApprovalFlowState {
  id: string
  flow_code: string
  flow_name: string
  approval_way: string
  assignment_type: string
  assigned_user_id: string
  is_customizable: boolean
  allowed_creator_roles: string
  is_custom: boolean
  created_by: any
  base_flow_id: any
  custom_status: any
  verified_by: any
  verified_at: any
  verification_notes: any
  rejection_reason: any
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}
