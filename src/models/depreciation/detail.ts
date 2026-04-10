export interface detailDepreProps {
  data: detailDepreState
  message: string
  status: string
}

export interface detailDepreState {
  id: number
  setting_type: string
  reference_id: number
  reference_value: string
  calculation_method: string
  depreciation_period: string
  useful_life_months: number
  depreciation_rate: any
  start_date: string
  end_date: any
  is_active: boolean
  created_at: string
  updated_at: string
}
