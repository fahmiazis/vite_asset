import { useQuery } from "@tanstack/react-query"
import {
  disposalApprovalStatus,
  type DisposalApprovalKind,
  type disposalApprovalStatusProps,
} from "../../../services/disposal/approvalStatus"

export const useDisposalApprovalStatus = (
  transactionNumber: string,
  kind: DisposalApprovalKind,
  enabled = true
) => {
  const { data, isLoading, error, refetch } = useQuery<disposalApprovalStatusProps>({
    queryKey: ["disposal-approval-status", transactionNumber, kind],
    queryFn: () => disposalApprovalStatus(transactionNumber, kind),
    enabled: enabled && !!transactionNumber,
    retry: false,
  })

  return { data, isLoading, error, refetch }
}
