// Mirror dto.UpdateApprovalFlowRequest (backend-go/dto/approval_dto.go).
//
// PENTING: `flow_code` sengaja TIDAK ada di sini. Kode flow dipakai backend
// untuk auto-lookup (PROCUREMENT_APPROVAL, MUTATION_APPROVAL, dst) — kalau
// diubah, transaksi yang mencari kode lama langsung gagal. Halaman edit
// menampilkannya read-only dan tidak pernah mengirimkannya.
//
// Catatan perilaku backend: field string kosong dianggap "tidak diubah"
// (`if req.FlowName != ""`), jadi deskripsi tidak bisa dikosongkan lewat API.
export interface UpdateApprovalFlowRequest {
  flow_name?: string
  approval_way?: string
  assignment_type?: string
  assigned_user_id?: string | null
  is_customizable?: boolean
  allowed_creator_roles?: string[]
  description?: string
  is_active?: boolean
}

export interface UpdateApprovalFlowResponse {
  data: any
  message: string
  status: string
}
