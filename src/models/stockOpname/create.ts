import type { stockOpnameDetailProps } from "./detail"

export interface CreateStockOpnameDraftRequest {
  transaction_date: string
  notes?: string
}

export type CreateStockOpnameDraftResponse = stockOpnameDetailProps
