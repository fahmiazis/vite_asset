import type { StockOpnameDetailState } from "./detail"

export interface StockOpnameTemplateRowError {
  row: number
  asset_number: string
  message: string
}

export interface StockOpnameTemplateUploadResult {
  updated_count: number
  failed_count: number
  errors: StockOpnameTemplateRowError[]
  detail: StockOpnameDetailState
}

export interface StockOpnameTemplateUploadResponse {
  data: StockOpnameTemplateUploadResult
  message: string
  status: string
}
