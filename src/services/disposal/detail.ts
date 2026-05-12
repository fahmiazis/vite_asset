import { axiosPrivate } from "../../libs/instance";
import type { disposalDetailProps } from "../../models/disposal/detail";

export const disposalDetail = async (id: string): Promise<disposalDetailProps> => {
    const res = await axiosPrivate.get(`/transactions/disposal/detail?transaction_number=${id}`)

    if (!res) {
        throw new Error('fail to get detail disposal')
    }

    const data = await res.data
    return data
}