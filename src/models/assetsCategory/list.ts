export interface assetsCategoryListProps {
  data: assetsCategoryListState[]
  message: string
  status: string
}

export interface assetsCategoryListState {
  id: number
  category_code: string
  category_name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}
