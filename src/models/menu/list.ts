export interface allMenuProps {
  data: allMenuState[]
  message: string
  status: string
}

export interface allMenuState {
  id: string
  parent_id: any
  name: string
  path: string
  icon_name: any
  order_index: number
  status: string
}
