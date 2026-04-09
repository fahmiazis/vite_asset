import { axiosPrivate } from "../../libs/instance";
import type { depreListProps } from "../../models/depreciation/list";
export const depreList = async (): Promise<depreListProps> => {
    const res = await axiosPrivate.get(`/depreciation-settings`)

    if (!res) {
        throw new Error('fail to get deprerciation list')
    }

    const data = await res.data
    return data
}