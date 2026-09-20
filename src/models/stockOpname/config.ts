export interface StockOpnameConfig {
  submission_start_day: number
  submission_end_day: number
  updated_by: string | null
  updated_at: string
}

export interface stockOpnameConfigProps {
  data: StockOpnameConfig
  message: string
  status: string
}

export interface UpdateStockOpnameConfigPayload {
  submission_start_day: number
  submission_end_day: number
}
