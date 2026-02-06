export interface roleListProps {
  data: roleListState[]
  message: string
  status: string
}

export interface roleListState {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}
