export interface listAssestProps {
  data: Data
  message: string
  status: string
}

export interface Data {
  data: listAssetsState[]
  limit: number
  page: number
  total: number
}

export interface listAssetsState {
  id: number
  asset_number: string
  asset_name: string
  description: any
  brand: any
  unit_of_measure: any
  unit_quantity: any
  location: any
  grouping: any
  category_id: number
  category_name: string
  branch_code: string
  io_number: string
  record_type: any
  asset_status: string
  created_at: string
  updated_at: string
  current_value: CurrentValue
}

export interface CurrentValue {
  id: number
  asset_id: number
  effective_date: string
  book_value: number
  acquisition_value: number
  accumulated_depreciation: number
  condition: any
  physical_status: any
  asset_status: string
  is_active: boolean
  created_at: string
  updated_at: string
}
