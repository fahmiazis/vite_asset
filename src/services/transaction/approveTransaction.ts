import { axiosPrivate } from "../../libs/instance";

export interface ApproveTransactionPayload {
    transaction_approval_id: string
    notes?: string
}

export const approveTransaction = async (payload: ApproveTransactionPayload) => {
    const res = await axiosPrivate.post(`/transaction-approvals/approve`, payload)

    if (!res) {
        throw new Error('fail to approve transaction')
    }

    return res.data
}