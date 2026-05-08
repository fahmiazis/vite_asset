import { axiosPrivate } from "../../libs/instance";

export interface ProcessBudgetPayload {
    notes?: string
}

export const processBudget = async (transactionNumber: string, payload: ProcessBudgetPayload) => {
    const res = await axiosPrivate.post(
        `/transactions/procurement/process-budget?transaction_number=${transactionNumber}`,
        payload
    )

    if (!res) {
        throw new Error('fail to process budget')
    }

    return res.data
}