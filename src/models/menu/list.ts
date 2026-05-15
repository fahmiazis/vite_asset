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
  route_path: string
  icon_name?: string
  order_index: number
  status: string
  children?: Children[]
}

export interface Children {
  id: string
  parent_id: string
  name: string
  path: string
  route_path: string
  icon_name?: string
  order_index: number
  status: string
}
