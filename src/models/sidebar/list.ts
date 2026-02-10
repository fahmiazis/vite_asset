export interface sidebarListProps {
  data: sidebarListState[]
  message: string
  status: string
}

export interface sidebarListState {
  id: string
  parent_id: any
  name: string
  path: string
  icon_name: any
  order_index: number
  status: string
  permissions: string[]
}
