import { axiosPrivate } from "../../libs/instance";
import type { approvalStatusMutationProps } from "../../models/mutation/approvalStatus";

export const approvalStatusMutationDetail = async (id: string): Promise<approvalStatusMutationProps> => {
    const res = await axiosPrivate.get(`/transactions/mutation/approval/status?transaction_number=${encodeURIComponent(id)}`)

    if (!res) {
        throw new Error('fail to get detail approval status')
    }

    const data = await res.data
    return data
}