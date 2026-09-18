import { useMutation, useQueryClient } from "@tanstack/react-query"
import { approveStockOpname, type ApproveStockOpnamePayload } from "../../../services/stockOpname/approve"

export function useApproveStockOpname(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ApproveStockOpnamePayload) => approveStockOpname(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-approval-status", transactionNumber] })
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })
    },
  })
}
