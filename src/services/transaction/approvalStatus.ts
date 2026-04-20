import { axiosPrivate } from "../../libs/instance";
import type { approvalStatusProps } from "../../models/transaction/approvalStatus";
export const approvalStatus = async (id: string): Promise<approvalStatusProps> => {
    const res = await axiosPrivate.get(`/transactions/procurement/approval-status?transaction_number=${id}`)

    if (!res) {
        throw new Error('fail to get approval status')
    }

    const data = await res.data
    return data
}