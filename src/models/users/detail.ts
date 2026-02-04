export interface DetailUserProps {
  data: DetailuserState
  message: string
  status: string
}

export interface DetailuserState {
  id: string
  username: string
  fullname: string
  email: string
  nik: any
  mpn_number: any
  status: string
  roles: Role[]
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  description: string
}
