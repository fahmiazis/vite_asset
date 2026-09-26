// ============================================================
// Rentang tanggal default untuk halaman daftar transaksi.
// ============================================================

/** YYYY-MM-DD dari tanggal lokal — bukan toISOString(), yang memakai UTC dan
 *  bisa menggeser tanggal satu hari untuk zona waktu Indonesia. */
export function toDateInput(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export interface DateRange {
  start_date: string
  end_date: string
}

/**
 * Rentang default: awal bulan kemarin sampai akhir bulan berjalan.
 *
 * Dua bulan dipilih supaya pengajuan yang dibuat akhir bulan lalu dan masih
 * berjalan tetap terlihat tanpa user perlu mengubah filter lebih dulu.
 *
 * `new Date(y, m, 0)` adalah hari terakhir bulan sebelumnya, jadi bulan+1
 * dengan tanggal 0 memberi akhir bulan berjalan — termasuk penanganan tahun
 * kabisat dan pergantian tahun.
 */
export function defaultDateRange(today: Date = new Date()): DateRange {
  const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return { start_date: toDateInput(start), end_date: toDateInput(end) }
}
