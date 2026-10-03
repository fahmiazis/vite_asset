/** Upload master data dari Excel — kontrak dto.ImportResult backend */

export type ImportEntity = "branch" | "user" | "asset"

/**
 * new = data baru (kode otomatis), update = mass update data yang ada,
 * member = khusus branch: set homebase & akses cabang user
 */
export type ImportMode = "new" | "update" | "member"

export interface ImportRowError {
  /** kunci i18n masterImport.errors.<code> */
  code: string
  field?: string
  params?: Record<string, string>
  /** cadangan (English) kalau kodenya belum dikenal */
  message: string
}

export interface ImportRowResult {
  /** nomor baris di Excel (header = 1) */
  row: number
  values: Record<string, string>
  errors: ImportRowError[]
  /**
   * branch_code / username / asset_number yang dibentuk atau diubah.
   * Mode member: set_homebase | add_access | unchanged
   */
  result?: string
}

export interface ImportResult {
  entity: ImportEntity
  mode: ImportMode
  dry_run: boolean
  columns: string[]
  total_rows: number
  valid_rows: number
  error_rows: number
  imported: number
  rows: ImportRowResult[]
}
