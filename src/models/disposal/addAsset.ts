export interface AddAssetToDisposalRequest {
  asset_id: number
  asset_number: string
  disposal_reason: string
  notes?: string
}

export interface AddAssetToDisposalResponse {
  data: {
    transaction_number: string
    asset_number: string
  }
  message: string
  status: string
}