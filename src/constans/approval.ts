// Nilai-nilai di bawah mengikuti enum kolom approval_flows / approval_flow_steps
// di backend (models/approval_flow.go, models/approval_flow_step.go) dan validasi
// `oneof` di dto/approval_dto.go. Kalau enum backend berubah, ubah juga di sini —
// request akan ditolak 400.

/**
 * flow_code bukan enum di DB (varchar(50)), tapi nilainya dipakai backend untuk
 * auto-lookup flow. Kalau kodenya salah ketik, transaksi gagal memulai approval:
 *   - PROCUREMENT_APPROVAL         → services/procurement_flow_service.go
 *   - MUTATION_APPROVAL            → services/mutation_flow_service.go
 *   - DISPOSAL_APPROVAL_REQUEST    → models/disposal_flow.go
 *   - DISPOSAL_APPROVAL_AGREEMENT  → models/disposal_flow.go
 *   - STOCK_OPNAME_APPROVAL        → belum dipakai backend (modulnya belum ada)
 * Catatan: (flow_code, branch_code) unik. Halaman create selalu memakai
 * branch_code default 'ALL', jadi satu kode cuma bisa dibuat sekali.
 */
export const flowCode = [
    { id: 'PROCUREMENT_APPROVAL', value: 'PROCUREMENT_APPROVAL', label: 'PROCUREMENT_APPROVAL' },
    { id: 'MUTATION_APPROVAL', value: 'MUTATION_APPROVAL', label: 'MUTATION_APPROVAL' },
    { id: 'DISPOSAL_APPROVAL_REQUEST', value: 'DISPOSAL_APPROVAL_REQUEST', label: 'DISPOSAL_APPROVAL_REQUEST' },
    { id: 'DISPOSAL_APPROVAL_AGREEMENT', value: 'DISPOSAL_APPROVAL_AGREEMENT', label: 'DISPOSAL_APPROVAL_AGREEMENT' },
    { id: 'STOCK_OPNAME_APPROVAL', value: 'STOCK_OPNAME_APPROVAL', label: 'STOCK_OPNAME_APPROVAL' },
];

// enum('sequential','parallel','conditional') — approval_flows.approval_way
export const approvalWay = [
    { id: 'sequential', value: 'sequential', label: 'Sequential' },
    { id: 'parallel', value: 'parallel', label: 'Parallel' },
    { id: 'conditional', value: 'conditional', label: 'Conditional' },
];

// enum('general','user_specific') — approval_flows.assignment_type
export const assignmentType = [
    { id: 'general', value: 'general', label: 'General' },
    { id: 'user_specific', value: 'user_specific', label: 'User Specific' },
];

// enum('creator','reviewer','approver','receiver') — approval_flow_steps.step_role
export const stepRole = [
    { id: 'creator', value: 'creator', label: 'Creator' },
    { id: 'reviewer', value: 'reviewer', label: 'Reviewer' },
    { id: 'approver', value: 'approver', label: 'Approver' },
    { id: 'receiver', value: 'receiver', label: 'Receiver' },
];

// enum('it','non-it','all') — approval_flow_steps.type
export const stepType = [
    { id: 'all', value: 'all', label: 'All' },
    { id: 'it', value: 'it', label: 'IT' },
    { id: 'non-it', value: 'non-it', label: 'Non-IT' },
];

// enum('budget','non-budget','return','all') — approval_flow_steps.category
export const stepCategory = [
    { id: 'all', value: 'all', label: 'All' },
    { id: 'budget', value: 'budget', label: 'Budget' },
    { id: 'non-budget', value: 'non-budget', label: 'Non-Budget' },
    { id: 'return', value: 'return', label: 'Return' },
];

// enum('web','upload') — approval_flow_steps.approval_way
export const stepApprovalWay = [
    { id: 'web', value: 'web', label: 'Web' },
    { id: 'upload', value: 'upload', label: 'Upload' },
];
