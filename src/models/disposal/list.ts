import type { DisposalAsset, DisposalStageHistory, Transaction } from "./detail"

export type { Transaction }

export interface disposalListProps {
  data: Data
  message: string
  status: string
}

export interface Data {
  data: disposalListState[]
  limit: number
  page: number
  total: number
}

export interface disposalListState {
  transaction: Transaction
  assets: DisposalAsset[]
  stages: DisposalStageHistory[]
}
