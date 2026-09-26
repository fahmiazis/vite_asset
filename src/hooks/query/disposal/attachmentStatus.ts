import { useQuery } from "@tanstack/react-query"
import type { disposalAttachmentStatusProps } from "../../../models/disposal/attachmentStatus"
import { disposalAttachmentStatus } from "../../../services/disposal/attachmentStatus"

export const useDisposalAttachmentStatus = (
  transactionNumber: string,
  stage: string,
  enabled = true
) => {
  const { data, isLoading, error, refetch } = useQuery<disposalAttachmentStatusProps>({
    queryKey: ["disposal-attachment-status", transactionNumber, stage],
    queryFn: () => disposalAttachmentStatus(transactionNumber, stage),
    enabled: enabled && !!transactionNumber && !!stage,
  })

  return { data, isLoading, error, refetch }
}
