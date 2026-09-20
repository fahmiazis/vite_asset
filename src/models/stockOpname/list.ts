import type { StockOpnameDetailState } from "./detail"

export interface stockOpnameListProps {
  data: Data
  message: string
  status: string
}

export interface Data {
  data: StockOpnameDetailState[]
  limit: number
  page: number
  total: number
}
