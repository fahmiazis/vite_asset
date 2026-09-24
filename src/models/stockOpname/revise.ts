import type { stockOpnameDetailProps } from "./detail"

// Stage APPROVAL → dipicu approver, stage EXECUTE_STOCK_OPNAME → dipicu eksekutor
export type ReviseStockOpnameMode = "approval" | "execute"

export interface ReviseStockOpnameRequest {
  asset_ids: number[]
  // true = semua asset direvisi, asset_ids diabaikan
  revise_all: boolean
  revision_notes: string
}

export interface ReviseStockOpnameByApproverRequest extends ReviseStockOpnameRequest {
  transaction_approval_id: string
}

export type ReviseStockOpnameResponse = stockOpnameDetailProps
