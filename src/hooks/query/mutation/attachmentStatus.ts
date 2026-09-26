import { useQuery } from "@tanstack/react-query"
import type { mutationAttachmentStatusProps } from "../../../models/mutation/attachmentStatus"
import { mutationAttachmentStatus } from "../../../services/mutation/attachmentStatus"

export const useMutationAttachmentStatus = (
  transactionNumber: string,
  enabled = true
) =>
  useQuery<mutationAttachmentStatusProps>({
    queryKey: ["mutation-attachment-status", transactionNumber],
    queryFn: () => mutationAttachmentStatus(transactionNumber),
    enabled: enabled && !!transactionNumber,
  })
