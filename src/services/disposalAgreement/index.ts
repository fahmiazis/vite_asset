import { axiosPrivate } from "../../libs/instance"
import type {
  CreateDisposalAgreementRequest,
  DisposalAgreementDetailProps,
  DisposalAgreementListProps,
  EligibleDisposalsProps,
} from "../../models/disposalAgreement"

const BASE = "/transactions/disposal-agreements"

/** transaksi yang sudah lolos approval request & belum masuk agreement aktif */
export const eligibleDisposals = async (): Promise<EligibleDisposalsProps> => {
  const res = await axiosPrivate.get(`${BASE}/eligible`)
  return res.data
}

export interface DisposalAgreementListParams {
  page: number
  limit: number
  stage?: string
  search?: string
  start_date?: string
  end_date?: string
}

export const disposalAgreementList = async (
  params: DisposalAgreementListParams
): Promise<DisposalAgreementListProps> => {
  const res = await axiosPrivate.get(BASE, { params })
  return res.data
}

export const disposalAgreementDetail = async (
  agreementNumber: string
): Promise<DisposalAgreementDetailProps> => {
  const res = await axiosPrivate.get(`${BASE}/detail`, {
    params: { agreement_number: agreementNumber },
  })
  return res.data
}

export const createDisposalAgreement = async (
  payload: CreateDisposalAgreementRequest
): Promise<DisposalAgreementDetailProps> => {
  const res = await axiosPrivate.post(BASE, payload)
  return res.data
}

/** status approval agreement — bentuk response-nya sama dengan approval lain */
export const disposalAgreementApprovalStatus = async (agreementNumber: string) => {
  const res = await axiosPrivate.get(`${BASE}/approval-status`, {
    params: { agreement_number: agreementNumber },
  })
  return res.data
}

export interface ReviseDisposalAgreementRequest {
  revision_notes: string
  /** disposal anggota yang dikeluarkan dan kembali ke DRAFT */
  transaction_numbers: string[]
}

/** approver step berjalan mengeluarkan anggota bermasalah ke DRAFT */
export const reviseDisposalAgreement = async (
  agreementNumber: string,
  payload: ReviseDisposalAgreementRequest
): Promise<DisposalAgreementDetailProps> => {
  const res = await axiosPrivate.post(`${BASE}/revise`, payload, {
    params: { agreement_number: agreementNumber },
  })
  return res.data
}
