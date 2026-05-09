import { useMutation, useQueryClient } from "@tanstack/react-query"
import { processBudget, type ProcessBudgetPayload } from "../../../services/transaction/processBudget"

export function useProcessBudget(transactionNumber: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: ProcessBudgetPayload) => processBudget(transactionNumber, payload),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["approval-transaction", transactionNumber] })
            queryClient.resetQueries({ queryKey: ["transaction-detail-with-stage"] })
        },
    })
}