export interface roleDetailProps {
  data: roleDetailState
  message: string
  status: string
}

export interface roleDetailState {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface CreateRoleRequest {
  name: string
  description?: string
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
}
