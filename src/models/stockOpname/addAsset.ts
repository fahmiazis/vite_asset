import type { stockOpnameDetailProps } from "./detail"

export interface AddStockOpnameAssetRequest {
  asset_id: number
  asset_number: string
}

export type AddStockOpnameAssetResponse = stockOpnameDetailProps
