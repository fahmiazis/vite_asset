import { useQuery } from "@tanstack/react-query"
import {
  handoverApprovalStatus,
  handoverAttachmentConfigs,
  handoverAttachmentStatus,
  handoverDetail,
  handoverEligibleAssets,
  handoverList,
  handoverRecipients,
  type HandoverListParams,
} from "../../services/handover"
import type { HandoverType } from "../../constans/handover"

export const useHandoverList = (params: HandoverListParams) =>
  useQuery({
    queryKey: ["handover-list", params],
    queryFn: () => handoverList(params),
    placeholderData: (prev) => prev,
  })

export const useHandoverDetail = (transactionNumber: string) =>
  useQuery({
    queryKey: ["handover-detail", transactionNumber],
    queryFn: () => handoverDetail(transactionNumber),
    enabled: !!transactionNumber,
  })

export const useHandoverEligibleAssets = (
  handoverType: HandoverType,
  search: string,
  excludeTransactionNumber?: string
) =>
  useQuery({
    queryKey: ["handover-eligible-assets", handoverType, search, excludeTransactionNumber ?? ""],
    queryFn: () => handoverEligibleAssets(handoverType, search, excludeTransactionNumber),
    placeholderData: (prev) => prev,
  })

export const useHandoverRecipients = (enabled = true) =>
  useQuery({
    queryKey: ["handover-recipients"],
    queryFn: handoverRecipients,
    enabled,
  })

export const useHandoverApprovalStatus = (transactionNumber: string, enabled = true) =>
  useQuery({
    queryKey: ["handover-approval-status", transactionNumber],
    queryFn: () => handoverApprovalStatus(transactionNumber),
    enabled: !!transactionNumber && enabled,
    retry: false, // 404 = approval belum dibentuk (masih draft)
  })

export const useHandoverAttachments = (transactionNumber: string, stage: string, branchCode: string, enabled = true) =>
  useQuery({
    queryKey: ["handover-attachments", transactionNumber, stage, branchCode],
    queryFn: async () => {
      const [status, configs] = await Promise.all([
        handoverAttachmentStatus(transactionNumber, stage, branchCode),
        handoverAttachmentConfigs(stage, branchCode),
      ])
      return { status, configs }
    },
    enabled: !!transactionNumber && !!branchCode && enabled,
  })
