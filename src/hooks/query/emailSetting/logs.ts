import { useQuery } from "@tanstack/react-query"
import type { emailLogListProps } from "../../../models/emailSetting/transactionEmail"
import { emailLogList, type EmailLogFilter } from "../../../services/emailSetting/transactionEmail"

export const useEmailLogList = (filter: EmailLogFilter) =>
  useQuery<emailLogListProps>({
    queryKey: ["email-log-list", filter.status ?? "", filter.transactionNumber ?? ""],
    queryFn: () => emailLogList(filter),
  })
