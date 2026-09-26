import { useMutation, useQueryClient } from "@tanstack/react-query"
import { initiateApprovalStockOpname } from "../../../services/stockOpname/initiateApproval"

export function useInitiateApprovalStockOpname(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => initiateApprovalStockOpname(transactionNumber),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })
      queryClient.invalidateQueries({ queryKey: ["stock-opname-approval-status", transactionNumber] })
    },
  })
}
