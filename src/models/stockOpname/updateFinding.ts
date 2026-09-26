import type { stockOpnameDetailProps } from "./detail"

export interface UpdateStockOpnameFindingRequest {
  asset_id: number
  physical_status: string
  condition: string
  asset_status?: string
  notes?: string
}

export type UpdateStockOpnameFindingResponse = stockOpnameDetailProps
