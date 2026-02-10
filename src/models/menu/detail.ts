export interface detailMenuProps {
  data: detailMenuState
  message: string
  status: string
}

export interface detailMenuState {
  id: string
  parent_id: any
  name: string
  path: string
  icon_name: any
  order_index: number
  status: string
}
