export interface permissionCatalogProps {
  data: permissionCatalogState
  message: string
  status: string
}

export interface permissionCatalogState {
  /** seluruh hak akses, dikelompokkan per module — untuk label & deskripsi */
  groups: PermissionGroup[]
  /** hak akses mana yang relevan untuk tiap menu (tabel menu_permissions) */
  menus: MenuPermissionOptions[]
}

export interface PermissionGroup {
  key: string
  label: string
  permissions: PermissionOption[]
}

export interface PermissionOption {
  id: string
  value: string
  label: string
  description: string
  module: string
}

export interface MenuPermissionOptions {
  menu_id: string
  route_path: string | null
  values: string[]
}

export interface SetMenuPermissionsRequest {
  permissions: string[]
}
