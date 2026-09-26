import type { ReportResponse, ReportTransactionInfo } from "./common"

/** satu baris per aset */
export interface DisposalReportRow extends ReportTransactionInfo {
  disposal_type: string
  agreement_number: string | null
  asset_number: string
  asset_name: string
  category_name: string
  disposal_reason: string | null
  sale_value: number | null
  income_value: number | null
  invoice_number: string | null
  invoice_date: string | null
  document_number: string | null
  /** PENDING / DELETED / CANCELLED */
  asset_status: string
}

export type DisposalReportResponse = ReportResponse<DisposalReportRow>
