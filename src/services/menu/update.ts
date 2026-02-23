import { axiosPrivate } from "../../libs/instance"
import type { UpdateMenuPayload } from "../../models/menu/update"
import { hasAtLeastOneField } from "../../utils/menu"


export const updateMenu = async (
    menuId: string,
    payload: UpdateMenuPayload
) => {
    if (!hasAtLeastOneField(payload)) {
        throw new Error('At least one field must be provided')
    }

    const { data } = await axiosPrivate.put(`/menus/${menuId}`, payload)
    return data
}