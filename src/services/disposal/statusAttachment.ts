import { axiosPrivate } from "../../libs/instance";
import type { AttachDisposalStatusProps } from "../../models/disposal/attachmentStatus";

export const statusDisposalDetail = async (id: string): Promise<AttachDisposalStatusProps> => {
    const res = await axiosPrivate.get(`/transactions/disposal/attachments/status?transaction_number=${id}&stage=DRAFT`)

    if (!res) {
        throw new Error('fail to get detail disposal')
    }

    const data = await res.data
    return data
}