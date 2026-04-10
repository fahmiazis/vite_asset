import { axiosPrivate } from "../../libs/instance";

export const deleteMenu = async (id: string) => {
    const res = await axiosPrivate.delete(`/v1/menus/${id}`)

    if (!res) {
        throw new Error('fail to delete menu')
    }

    return res.data
}