import { axiosPrivate } from "../../libs/instance";
import type { detailTransactionWStageProps } from "../../models/transaction/detailWStages";

export const TransactionDetailWStage = async (id: string): Promise<detailTransactionWStageProps> => {
    const res = await axiosPrivate.get(`/transactions/procurement/detail-stage?transaction_number=${id}`)

    if (!res) {
        throw new Error('fail to get detail transaction with stage')
    }

    const data = await res.data
    return data
}