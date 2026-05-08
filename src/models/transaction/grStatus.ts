export interface GRStatusProps {
  data: GRStatusState
  message: string
  status: string
}

export interface GRStatusState {
  transaction_number: string
  current_stage: string
  total_assets: number
  gr_done: number
  gr_pending: number
  items: Item[]
}

export interface Item {
  procurement_item_id: number
  item_name: string
  quantity: number
  branch_code: string
  assets: Asset[]
}

export interface Asset {
  asset_id: number
  asset_number: string
  asset_name: string
  branch_code: string
  io_number: string
  gr_status: string
  gr_date: string
  gr_by: string
}
