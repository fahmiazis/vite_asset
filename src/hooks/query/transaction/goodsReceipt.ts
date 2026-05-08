import { useQuery } from "@tanstack/react-query"
import { getGoodsReceipt, type GRStatusFilter } from "../../../services/transaction/getGoodsReceipt"
import type { GRStatusProps } from "../../../models/transaction/grStatus"

export const useGoodsReceiptStatus = (transactionNumber: string, grStatus?: GRStatusFilter) => {
    const { data, isLoading, error, refetch } = useQuery<GRStatusProps>({
        queryKey: ["goods-receipt", transactionNumber, grStatus],
        queryFn: () => getGoodsReceipt(transactionNumber, grStatus),
        enabled: !!transactionNumber,
    })

    return { data, isLoading, error, refetch }
}