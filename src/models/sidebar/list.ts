export interface sidebarListProps {
  data: sidebarListState[]
  message: string
  status: string
}

export interface sidebarListState {
  id: string
  parent_id: string | null
  name: string
  menu_type?: string
  /** bisa null untuk menu yang hanya jadi grup sub menu */
  path: string | null
  icon_name: string | null
  order_index: number
  status: string
  permissions?: string[]
  children?: sidebarListState[]
}
