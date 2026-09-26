// Mirror dto.UpdateApprovalFlowStepRequest (backend-go/dto/approval_dto.go).
// Semua field opsional — backend memakai pointer, jadi field yang tidak dikirim
// tidak diubah. Jangan kirim string kosong untuk enum: gagal validasi `oneof`.
export interface UpdateFlowStepRequest {
  step_order?: number
  step_name?: string
  step_role?: string
  role_id?: string | null
  branch_id?: string | null
  structure?: string | null
  is_required?: boolean
  can_skip?: boolean
  is_visible?: boolean
  type?: string
  category?: string
  approval_way?: string
  auto_approve?: boolean
  timeout_hours?: number | null
  conditions?: string | null
}

export interface UpdateFlowStepResponse {
  data: any
  message: string
  status: string
}
