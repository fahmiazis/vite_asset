import { useMutation, useQueryClient } from "@tanstack/react-query"
import { initiateApproval } from "../../../services/transaction/initiateApproval"

export function useInitiateApproval(transactionNumber: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => initiateApproval(transactionNumber),
        // Kartu approval di detail membaca approval-status, yang sudah
        // ter-fetch kosong begitu verify memindah stage ke APPROVAL.
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["transaction-detail", transactionNumber] })
            queryClient.invalidateQueries({ queryKey: ["approval-status"] })
            queryClient.invalidateQueries({ queryKey: ["transaction-detail-with-stage"] })
            queryClient.invalidateQueries({ queryKey: ["transaction-list"] })
        },
    })
}