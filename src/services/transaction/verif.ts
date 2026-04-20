import { axiosPrivate } from "../../libs/instance";

export interface VerifyProcurementItem {
    transaction_procurement_id: number
    item_type: "ASSET" | "NON_ASSET"
    notes?: string
}

export interface VerifyProcurementPayload {
    items: VerifyProcurementItem[]
    notes?: string
}

export const verifyProcurement = async (transactionNumber: string, payload: VerifyProcurementPayload) => {
    const res = await axiosPrivate.post(
        `/transactions/procurement/verify?transaction_number=${encodeURIComponent(transactionNumber)}`,
        payload
    )

    if (!res) {
        throw new Error('fail to verify procurement')
    }

    return res.data
}