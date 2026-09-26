// ============================================================
// Helper tampilan step approval — dipakai panel disposal dan
// halaman detail disposal agreement, yang merender daftar step
// yang sama persis.
// ============================================================

interface ApprovalActor {
  status: string
  approved_by_name?: string | null
  rejected_by_name?: string | null
}

/**
 * Nama orang yang memutuskan satu step approval, atau null kalau step-nya
 * belum diputuskan.
 *
 * Role saja tidak cukup untuk step yang sudah selesai: satu role bisa dipegang
 * beberapa orang, jadi tanpa nama tidak ketahuan siapa yang bertanggung jawab
 * atas keputusannya.
 */
export function approvalActorName(approval: ApprovalActor): string | null {
  const status = approval.status?.toUpperCase()
  if (status === "APPROVED") return approval.approved_by_name ?? null
  if (status === "REJECTED") return approval.rejected_by_name ?? null
  return null
}

/** "pic branch - (budi)" kalau sudah diputuskan, "pic branch" kalau belum */
export function approvalRoleWithActor(
  roleName: string | null | undefined,
  approval: ApprovalActor
): string {
  const role = roleName ?? "-"
  const actor = approvalActorName(approval)
  return actor ? `${role} - (${actor})` : role
}
