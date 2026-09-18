export interface approvalStatusStockOpnameProps {
  data: approvalStatusStockOpnameState
  message: string
  status: string
}

export interface approvalStatusStockOpnameState {
  transaction_number: string
  transaction_type: string
  total_steps: number
  completed_steps: number
  current_step: FlowStep
  status: string
  approvals: Approval[]
  created_at: string
}

export interface Approval {
  id: string
  flow_id: string
  flow_step_id: string
  transaction_number: string
  transaction_type: string
  approver_user_id: string | null
  approver_role_id: string | null
  approver_role_name: string
  status: string
  status_view: string
  approved_at: string | null
  approved_by: string | null
  rejected_at: string | null
  rejected_by: string | null
  notes: string | null
  metadata: string | null
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
  role_id: string | null
  branch_id: string | null
  structure: string | null
  is_required: boolean
  can_skip: boolean
  is_visible: boolean
  type: string
  category: string
  approval_way: string
  auto_approve: boolean
  timeout_hours: number | null
  conditions: string | null
  created_at: string
  updated_at: string
}
