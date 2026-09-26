/**
 * Mirror dto.UpdateAssetCategoryRequest (backend-go/dto/asset_category_dto.go).
 * Semua field pointer di backend, jadi yang tidak dikirim tidak diubah.
 */
export interface UpdateAssetsCategoryPayload {
  category_code?: string
  category_name?: string
  description?: string | null
  is_active?: boolean
}

export interface AssetsCategoryDetailProps {
  data: {
    id: number
    category_code: string
    category_name: string
    description: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }
  message: string
  status: string
}
