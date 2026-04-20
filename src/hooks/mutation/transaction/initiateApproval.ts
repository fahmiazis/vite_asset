import { useMutation, useQueryClient } from "@tanstack/react-query"
import { initiateApproval } from "../../../services/transaction/initiateApproval"

export function useInitiateApproval(transactionNumber: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => initiateApproval(transactionNumber),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["transaction-detail", transactionNumber] })
        },
    })
}