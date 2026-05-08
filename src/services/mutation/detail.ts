import { axiosPrivate } from "../../libs/instance";
import type { detailMutationProps } from "../../models/mutation/detail";
export const mutationDetail = async (id: string): Promise<detailMutationProps> => {
    const res = await axiosPrivate.get(`/transactions/mutation/detail?transaction_number=${encodeURIComponent(id)}`)

    if (!res) {
        throw new Error('fail to get detail mutation')
    }

    const data = await res.data
    return data
}