import { axiosPrivate } from "../../libs/instance";

export interface ExecuteAssetPayload {
    notes?: string
}

export const executeAsset = async (transactionNumber: string, payload: ExecuteAssetPayload) => {
    const res = await axiosPrivate.post(
        `/transactions/procurement/execute?transaction_number=${transactionNumber}`,
        payload
    )

    if (!res) {
        throw new Error('fail to execute asset')
    }

    return res.data
}