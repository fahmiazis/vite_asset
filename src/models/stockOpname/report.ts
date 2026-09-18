// ============================================================
// Shared
// ============================================================

export interface StockOpnameReportFilterParams {
  month?: number
  year?: number
  branch_code?: string
}

export interface StockOpnameReportPeriod {
  month: number
  year: number
  start_date: string
  end_date: string
}

export interface StockOpnameStatusBreakdown {
  finish: number
  in_progress: number
  belum_submit: number
  rejected: number
  revisi: number
  disposal: number
}

// ============================================================
// Dashboard
// ============================================================

export interface StockOpnameDashboardStats {
  total_asset: number
  finish: number
  finish_percentage: number
  in_progress: number
  belum_submit: number
  rejected: number
  revisi: number
  disposal: number
  acquisition_value: number
  book_value: number
}

export interface StockOpnameGroupingStatus {
  grouping: string
  status: StockOpnameStatusBreakdown
  total: number
}

export interface StockOpnamePhysicalVsSystem {
  physical_ada: number
  physical_tidak_ada: number
  system_ada: number
  system_tidak_ada: number
}

export interface StockOpnameConditionSummary {
  baik: number
  rusak: number
  tidak_ada: number
  belum_isi: number
}

export interface StockOpnameDashboardCharts {
  status_per_grouping: StockOpnameGroupingStatus[]
  physical_vs_system: StockOpnamePhysicalVsSystem
  condition_summary: StockOpnameConditionSummary
  status_submit: StockOpnameStatusBreakdown
}

export interface StockOpnameDashboardData {
  period: StockOpnameReportPeriod
  branch_code: string
  stats: StockOpnameDashboardStats
  charts: StockOpnameDashboardCharts
}

export interface stockOpnameDashboardReportProps {
  data: StockOpnameDashboardData
  message: string
  status: string
}

// ============================================================
// Detail Report
// ============================================================

export interface StockOpnameRekapRow {
  label: string
  acquisition_value: number
  accumulated_depreciation: number
  book_value: number
  unit_count: number
  extra_info?: string
  supported: boolean
}

export interface StockOpnameAreaSummary {
  area_clear_count: number
  area_clear_percentage: number
  area_not_clear_count: number
  area_not_clear_percentage: number
  total_area: number
}

export interface StockOpnameCostCenterRow {
  branch_code: string
  branch_name: string
  acquisition_value: number
  book_value: number
  unit_count: number
}

export interface StockOpnameDetailReportData {
  period: StockOpnameReportPeriod
  branch_code: string
  rekap: StockOpnameRekapRow[]
  area_summary: StockOpnameAreaSummary
  cost_centers_top10: StockOpnameCostCenterRow[]
  note: string
}

export interface stockOpnameDetailReportProps {
  data: StockOpnameDetailReportData
  message: string
  status: string
}
