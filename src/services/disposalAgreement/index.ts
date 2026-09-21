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

export const disposalAgreementList = async (params: {
  page: number
  limit: number
  stage?: string
  search?: string
}): Promise<DisposalAgreementListProps> => {
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
