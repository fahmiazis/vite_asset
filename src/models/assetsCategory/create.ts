export interface CreateAssetsCategoryPayload {
    category_code: string
    category_name: string
    description: string
    is_active: boolean
}

export interface CreateAssetsCategoryResponse {
    data: {
        id: number
        category_code: string
        category_name: string
        description: string
        is_active: boolean
        created_at: string
        updated_at: string
    }
    message: string
    status: string
}