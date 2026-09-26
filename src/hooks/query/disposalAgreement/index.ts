import { useQuery } from "@tanstack/react-query"
import {
  disposalAgreementApprovalStatus,
  disposalAgreementDetail,
  disposalAgreementList,
  eligibleDisposals,
  type DisposalAgreementListParams,
} from "../../../services/disposalAgreement"
import type {
  DisposalAgreementDetailProps,
  DisposalAgreementListProps,
  EligibleDisposalsProps,
} from "../../../models/disposalAgreement"
import type { approvalStatusMutationProps } from "../../../models/mutation/approvalStatus"

export const useEligibleDisposals = (enabled = true) =>
  useQuery<EligibleDisposalsProps>({
    queryKey: ["disposal-agreement-eligible"],
    queryFn: eligibleDisposals,
    enabled,
  })

export const useDisposalAgreementList = (params: DisposalAgreementListParams) =>
  useQuery<DisposalAgreementListProps>({
    queryKey: ["disposal-agreement-list", params],
    queryFn: () => disposalAgreementList(params),
    placeholderData: (prev) => prev,
  })

export const useDisposalAgreementDetail = (agreementNumber: string) =>
  useQuery<DisposalAgreementDetailProps>({
    queryKey: ["disposal-agreement-detail", agreementNumber],
    queryFn: () => disposalAgreementDetail(agreementNumber),
    enabled: !!agreementNumber,
  })

export const useDisposalAgreementApprovalStatus = (agreementNumber: string) =>
  useQuery<approvalStatusMutationProps>({
    queryKey: ["disposal-agreement-approval-status", agreementNumber],
    queryFn: () => disposalAgreementApprovalStatus(agreementNumber),
    enabled: !!agreementNumber,
    retry: false,
  })
