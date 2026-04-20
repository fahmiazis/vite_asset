import { axiosPrivate } from "../../libs/instance";

export const initiateApproval = async (transactionNumber: string) => {
    const res = await axiosPrivate.post(
        `/transactions/procurement/approval/initiate?transaction_number=${encodeURIComponent(transactionNumber)}`
    )

    if (!res) {
        throw new Error('fail to initiate approval')
    }

    return res.data
}