export interface roleMenusProps {
  data: RoleMenuState[]
  message: string
  status: string
}

/** Menu yang di-assign ke sebuah role, beserta permissions-nya */
export interface RoleMenuState {
  id: string
  parent_id: string | null
  name: string
  menu_type?: string
  path: string | null
  route_path?: string | null
  icon_name: string | null
  order_index: number
  status: string
  permissions?: string[]
  children?: RoleMenuState[]
}
