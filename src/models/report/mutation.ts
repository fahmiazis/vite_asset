import type { ReportResponse, ReportTransactionInfo } from "./common"

/** satu baris per aset */
export interface MutationReportRow extends ReportTransactionInfo {
  asset_number: string
  asset_name: string
  category_name: string
  from_branch_code: string
  from_branch_name: string
  to_branch_code: string
  to_branch_name: string
  from_location: string | null
  to_location: string | null
  document_number: string | null
  /** PENDING / EXECUTED / CANCELLED */
  asset_status: string
}

export type MutationReportResponse = ReportResponse<MutationReportRow>
