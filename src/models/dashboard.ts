export interface DashboardAssetValues {
  /** YYYY-MM — bulan berjalan */
  period: string
  total_assets: number
  acquisition_value: number
  book_value: number
  accumulated_depreciation: number
}

export interface DashboardFlowRow {
  /** YYYY-MM */
  month: string
  transaction_type: string
  finished: number
  in_progress: number
  rejected: number
  cancelled: number
}

export interface DashboardTypeCount {
  transaction_type: string
  count: number
}

export interface DashboardRecentTransaction {
  transaction_number: string
  transaction_type: string
  transaction_date: string
  current_stage: string
  status: string
  created_by_name: string
}

export interface DashboardSummaryResponse {
  status: string
  message: string
  data: {
    asset_values: DashboardAssetValues
    /** 6 bulan terakhir termasuk bulan berjalan, per jenis transaksi */
    flow: DashboardFlowRow[]
    /** jumlah transaksi bulan berjalan per jenis */
    month_counts: DashboardTypeCount[]
    /** transaksi terbaru, maksimal 10 per jenis */
    recent: DashboardRecentTransaction[]
  }
}
