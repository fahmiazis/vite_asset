import { axiosPrivate } from "../../libs/instance";
import type { detailMenuProps } from "../../models/menu/detail";
export const menuDetail = async (id: string): Promise<detailMenuProps> => {
    const res = await axiosPrivate.get(`/api/v1/menus/${id}`)

    if (!res) {
        throw new Error('fail to get detail menus')
    }

    const data = await res.data
    return data
}