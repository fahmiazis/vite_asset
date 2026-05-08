import { useMutation, useQueryClient } from "@tanstack/react-query"
import { goodsReceipt, type GoodsReceiptPayload } from "../../../services/transaction/goodsReceipt"

export function useGoodsReceipt(transactionNumber: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: GoodsReceiptPayload) => goodsReceipt(transactionNumber, payload),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["approval-transaction", transactionNumber] })
        },
    })
}