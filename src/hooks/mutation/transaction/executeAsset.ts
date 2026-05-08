import { useMutation, useQueryClient } from "@tanstack/react-query"
import { executeAsset, type ExecuteAssetPayload } from "../../../services/transaction/executeAsset"

export function useExecuteAsset(transactionNumber: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: ExecuteAssetPayload) => executeAsset(transactionNumber, payload),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["approval-transaction", transactionNumber] })
        },
    })
}