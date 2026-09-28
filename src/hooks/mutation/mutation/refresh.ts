import type { QueryClient } from "@tanstack/react-query"

/**
 * Refresh semua data mutasi setelah aksi apa pun. Satu aksi bisa memindah
 * stage, membentuk/menghapus baris approval, dan mengubah status dokumen
 * sekaligus, jadi lebih aman me-refresh semuanya daripada memilih-milih key
 * (dulu banyak hook me-refresh "mutation-draft-detail" yang tidak dipakai
 * query mana pun, sehingga halaman baru berubah setelah reload).
 */
export function refreshMutationQueries(queryClient: QueryClient) {
  const keys = [
    "mutation-detail",
    "mutation-approval-status",
    "mutation-attachment-status",
    "mutation-list",
    "attachments",
    "asset-detail",
  ]
  keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
}
