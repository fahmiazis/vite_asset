export interface StockOpnamePhysicalStatusMaster {
  id: number
  code: string
  label: string
  requires_borrow_document: boolean
  counts_as_missing: boolean
  is_system: boolean
  created_at: string
  // Kondisi yang boleh dipilih buat status fisik ini (diatur di master data)
  allowed_conditions: StockOpnameConditionRef[]
}

export interface StockOpnameConditionRef {
  id: number
  code: string
  label: string
}

export interface StockOpnameConditionMaster {
  id: number
  code: string
  label: string
  report_bucket: string
  is_system: boolean
  created_at: string
}

export interface CreateStockOpnamePhysicalStatusMasterPayload {
  code: string
  label: string
  requires_borrow_document: boolean
  counts_as_missing: boolean
  // minimal 1
  condition_ids: number[]
}

export interface UpdateStockOpnamePhysicalStatusConditionsPayload {
  condition_ids: number[]
}

export interface CreateStockOpnameConditionMasterPayload {
  code: string
  label: string
  report_bucket: "" | "BAIK" | "RUSAK"
  // opsional: langsung dipasangkan ke status fisik ini
  physical_status_ids: number[]
}

export interface stockOpnamePhysicalStatusMasterListProps {
  data: StockOpnamePhysicalStatusMaster[]
  message: string
  status: string
}

export interface stockOpnamePhysicalStatusMasterCreateProps {
  data: StockOpnamePhysicalStatusMaster
  message: string
  status: string
}

export interface stockOpnameConditionMasterListProps {
  data: StockOpnameConditionMaster[]
  message: string
  status: string
}

export interface stockOpnameConditionMasterCreateProps {
  data: StockOpnameConditionMaster
  message: string
  status: string
}

