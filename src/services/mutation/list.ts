import { axiosPrivate } from "../../libs/instance";
import type { mutationListProps } from "../../models/mutation/list";

export const mutationList = async (): Promise<mutationListProps> => {
    const res = await axiosPrivate.get(`/mutation?page=1&limit=10`)

    if (!res) {
        throw new Error('fail to get list mutation')
    }

    const data = await res.data
    return data
}