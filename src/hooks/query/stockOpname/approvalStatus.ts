import { useQuery } from "@tanstack/react-query"
import { approvalStatusStockOpnameDetail } from "../../../services/stockOpname/approvalStatus"
import type { approvalStatusStockOpnameProps } from "../../../models/stockOpname/approvalStatus"

export const useStockOpnameApprovalStatus = (transactionNumber: string) => {
  const { data, isLoading, error, refetch } = useQuery<approvalStatusStockOpnameProps>({
    queryKey: ["stock-opname-approval-status", transactionNumber],
    queryFn: () => approvalStatusStockOpnameDetail(transactionNumber),
    enabled: !!transactionNumber,
    retry: false,
  })

  return { data, isLoading, error, refetch }
}
