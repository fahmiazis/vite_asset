export interface StockOpnamePhysicalStatusMaster {
  id: number
  code: string
  label: string
  requires_borrow_document: boolean
  requires_not_applicable_condition: boolean
  counts_as_missing: boolean
  is_system: boolean
  created_at: string
}

export interface StockOpnameConditionMaster {
  id: number
  code: string
  label: string
  is_not_applicable_value: boolean
  report_bucket: string
  is_system: boolean
  created_at: string
}

export interface CreateStockOpnamePhysicalStatusMasterPayload {
  code: string
  label: string
  requires_borrow_document: boolean
  requires_not_applicable_condition: boolean
  counts_as_missing: boolean
}

export interface CreateStockOpnameConditionMasterPayload {
  code: string
  label: string
  is_not_applicable_value: boolean
  report_bucket: "" | "BAIK" | "RUSAK"
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

