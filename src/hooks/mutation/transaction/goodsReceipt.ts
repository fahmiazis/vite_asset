import { useMutation, useQueryClient } from "@tanstack/react-query"
import { goodsReceipt, type GoodsReceiptPayload } from "../../../services/transaction/goodsReceipt"

export function useGoodsReceipt(transactionNumber: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: GoodsReceiptPayload) => goodsReceipt(transactionNumber, payload),
        // Status per aset ada di goods-receipt (modal GR) dan gr_status/stage di
        // detail — GR aset terakhir memindah stage ke FINISHED.
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["approval-transaction", transactionNumber] })
            queryClient.invalidateQueries({ queryKey: ["goods-receipt"] })
            queryClient.invalidateQueries({ queryKey: ["transaction-detail-with-stage"] })
            queryClient.invalidateQueries({ queryKey: ["transaction-list"] })
            queryClient.invalidateQueries({ queryKey: ["asset-detail"] })
        },
    })
}