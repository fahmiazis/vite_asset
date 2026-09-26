export interface ReorderMenuItem {
  id: string
  parent_id: string | null
  order_index: number
}

export interface ReorderMenusRequest {
  menus: ReorderMenuItem[]
}
