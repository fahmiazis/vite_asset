import { axiosPrivate } from "../../libs/instance";

export interface GoodsReceiptPayload {
    asset_id: number
    asset_number: string
    gr_date: string
    notes?: string
}

export const goodsReceipt = async (transactionNumber: string, payload: GoodsReceiptPayload) => {
    const res = await axiosPrivate.post(
        `/transactions/procurement/gr?transaction_number=${transactionNumber}`,
        payload
    )

    if (!res) {
        throw new Error('fail to submit goods receipt')
    }

    return res.data
}