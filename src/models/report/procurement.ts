import type { ReportResponse, ReportTransactionInfo } from "./common"

/** satu baris per barang */
export interface ProcurementReportRow extends ReportTransactionInfo {
  item_name: string
  category_name: string
  quantity: number
  unit_price: number
  total_price: number
  /** "BC000005 (10), C00001 (5)" */
  distribution: string
  item_notes: string | null
}

export type ProcurementReportResponse = ReportResponse<ProcurementReportRow>
