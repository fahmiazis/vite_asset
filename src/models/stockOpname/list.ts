import type { StockOpnameTransaction } from "./detail"

export interface stockOpnameListProps {
  data: Data
  message: string
  status: string
}

export interface Data {
  data: StockOpnameListItem[]
  limit: number
  page: number
  total: number
}

/** baris list — ringan, tanpa items/stages (ambil dari /detail) */
export interface StockOpnameListItem {
  transaction: StockOpnameTransaction
  item_count: number
  is_submissive: boolean | null
}
