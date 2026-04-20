import { useMutation, useQueryClient } from "@tanstack/react-query"
import { verifyProcurement, type VerifyProcurementPayload } from "../../../services/transaction/verif"

export function useVerifyProcurement(transactionNumber: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: VerifyProcurementPayload) =>
            verifyProcurement(transactionNumber, payload),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["transaction-detail", transactionNumber] })
        },
    })
}