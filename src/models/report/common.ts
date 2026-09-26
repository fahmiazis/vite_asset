// Bagian yang sama di report procurement, mutation, dan disposal.

export interface ReportFilterParams {
  start_date?: string
  end_date?: string
  /** kosong = semua cabang yang boleh dilihat user */
  branch_code?: string
  stage?: string
  search?: string
}

export interface ReportBranchOption {
  branch_code: string
  branch_name: string
}

export interface ReportStageCount {
  stage: string
  /** jumlah transaksi, bukan baris */
  count: number
}

export interface ReportSummary {
  total_transactions: number
  total_rows: number
  total_quantity: number
  /** procurement: total harga; disposal: nilai jual */
  total_value: number
  /** disposal: nilai pemasukan */
  total_income: number
  /** dihitung sebelum filter stage, dipakai untuk angka tab */
  by_stage: ReportStageCount[]
}

export interface ReportTransactionInfo {
  transaction_number: string
  transaction_date: string
  /** cabang pengaju */
  branch_code: string
  branch_name: string
  current_stage: string
  status: string
  notes: string | null
  created_by_name: string
}

export interface ReportResponse<T> {
  status: string
  message: string
  data: {
    branches: ReportBranchOption[]
    /** admin — tidak dibatasi cabang */
    all_branches: boolean
    summary: ReportSummary
    rows: T[]
  }
}
