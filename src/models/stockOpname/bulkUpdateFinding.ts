import type { StockOpnameTemplateUploadResult } from "./template"

export interface BulkUpdateStockOpnameFindingItem {
  asset_id: number
  physical_status?: string
  condition?: string
  asset_status?: string
  notes?: string
}

export interface BulkUpdateStockOpnameFindingRequest {
  items: BulkUpdateStockOpnameFindingItem[]
}

export interface BulkUpdateStockOpnameFindingResponse {
  data: StockOpnameTemplateUploadResult
  message: string
  status: string
}
