export interface UpdateMenuPayload {
  name?: string
  parent_id?: string
  path?: string
  route_path?: string
  icon_name?: string
  status?: 'active' | 'inactive'
}