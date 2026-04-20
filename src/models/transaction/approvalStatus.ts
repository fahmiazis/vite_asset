export interface approvalStatusProps {
  data: Data
  message: string
  status: string
}

export interface Data {
  transaction_number: string
  transaction_type: string
  total_steps: number
  completed_steps: number
  current_step: CurrentStep
  status: string
  approvals: approvalStatusState[]
  created_at: string
}

export interface CurrentStep {
  id: string
  flow_id: string
  step_order: number
  step_name: string
  step_role: string
  role_id: string
  branch_id: any
  structure: string
  is_required: boolean
  can_skip: boolean
  is_visible: boolean
  type: string
  category: string
  approval_way: string
  auto_approve: boolean
  timeout_hours: any
  conditions: any
  created_at: string
  updated_at: string
}

export interface approvalStatusState {
  id: string
  flow_id: string
  flow_step_id: string
  transaction_number: string
  transaction_type: string
  approver_user_id: any
  approver_role_id: string
  approver_role_name: string
  status: string
  status_view: string
  approved_at: any
  approved_by: any
  rejected_at: any
  rejected_by: any
  notes: any
  metadata: any
  created_at: string
  updated_at: string
  flow_step: FlowStep
}

export interface FlowStep {
  id: string
  flow_id: string
  step_order: number
  step_name: string
  step_role: string
  role_id: string
  branch_id: any
  structure: string
  is_required: boolean
  can_skip: boolean
  is_visible: boolean
  type: string
  category: string
  approval_way: string
  auto_approve: boolean
  timeout_hours: any
  conditions: any
  created_at: string
  updated_at: string
}
