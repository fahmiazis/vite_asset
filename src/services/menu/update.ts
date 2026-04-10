import { axiosPrivate } from "../../libs/instance";

export interface UpdateMenuPayload {
    name: string
    parent_id?: string | null
    path: string
    route_path: string
    icon_name?: string | null
    status: string
}

export const updateMenu = async (id: string, payload: UpdateMenuPayload) => {
    const res = await axiosPrivate.put(`/v1/menus/${id}`, payload)

    if (!res) {
        throw new Error('fail to update menu')
    }

    return res.data
}