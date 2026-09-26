/**
 * Kesepakatan disposal (agreement) — menggabungkan beberapa transaksi disposal
 * yang sudah lolos APPROVAL_REQUEST untuk disetujui sekaligus oleh manajemen
 * puncak. Punya nomor sendiri: 0001/IX/2026-DPSL-AGMNT
 */
export interface DisposalAgreementItem {
  transaction_id: number
  transaction_number: string
  disposal_type: string | null
  current_stage: string
  branch_code: string
  created_by: string
  created_by_name?: string | null
  total_assets: number
  total_sale_value?: number | null
}

/** aset dari seluruh transaksi anggota, diratakan jadi satu daftar */
export interface DisposalAgreementAsset {
  disposal_asset_id: number
  asset_id: number
  asset_number: string
  asset_name?: string | null
  category_name?: string | null
  branch_code?: string | null
  disposal_type: string
  disposal_reason: string | null
  sale_value: number | null
  transaction_number: string
}

export interface DisposalAgreement {
  id: number
  agreement_number: string
  current_stage: string
  status: string
  notes: string | null
  rejection_reason: string | null
  created_by: string
  created_by_name?: string | null
  total_items: number
  total_assets: number
  items?: DisposalAgreementItem[]
  assets?: DisposalAgreementAsset[]
  created_at: string
  updated_at: string
}

export interface DisposalAgreementListProps {
  data: {
    data: DisposalAgreement[]
    total: number
    page: number
    limit: number
  }
  message: string
  status: string
}

export interface DisposalAgreementDetailProps {
  data: DisposalAgreement
  message: string
  status: string
}

export interface EligibleDisposalsProps {
  data: DisposalAgreementItem[]
  message: string
  status: string
}

export interface CreateDisposalAgreementRequest {
  transaction_numbers: string[]
  notes?: string
}
