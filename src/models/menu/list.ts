export interface allMenuProps {
  data: allMenuState[]
  message: string
  status: string
}

export type MenuType = "page" | "group" | "permission"

export interface allMenuState {
  id: string
  parent_id: any
  name: string
  /** page = halaman biasa · group = wadah sidebar · permission = hanya hak akses, tidak tampil di sidebar */
  menu_type: MenuType
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
  menu_type: MenuType
  path: string
  route_path: string
  icon_name?: string
  order_index: number
  status: string
  /** menu bertipe permission boleh berada di level ketiga */
  children?: Children[]
}
