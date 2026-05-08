import { axiosPrivate } from "../../libs/instance";

export type GRStatusFilter = "PENDING_RECEIPT" | "DONE" | undefined

export const getGoodsReceipt = async (transactionNumber: string, grStatus?: GRStatusFilter) => {
    const params = new URLSearchParams({ transaction_number: transactionNumber })
    if (grStatus) params.append("gr_status", grStatus)

    const res = await axiosPrivate.get(`/transactions/procurement/gr?${params.toString()}`)

    if (!res) {
        throw new Error('fail to fetch goods receipt')
    }

    return res.data
}