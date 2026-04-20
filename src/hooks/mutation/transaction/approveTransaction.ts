import { useMutation, useQueryClient } from "@tanstack/react-query"
import { approveTransaction, type ApproveTransactionPayload } from "../../../services/transaction/approveTransaction"

export function useApproveTransaction(transactionNumber: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: ApproveTransactionPayload) => approveTransaction(payload),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["approval-transaction", transactionNumber] })
        },
    })
}