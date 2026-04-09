import { axiosPrivate } from "../../libs/instance";
import type { detailtransactionProps } from "../../models/transaction/detail";
export const TransactionDetail = async (id: string): Promise<detailtransactionProps> => {
    const res = await axiosPrivate.get(`/transactions/procurement/detail?number=${id}`)

    if (!res) {
        throw new Error('fail to get detail transaction')
    }

    const data = await res.data
    return data
}