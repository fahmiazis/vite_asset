import { axiosPrivate } from "../../libs/instance";

export const deleteDepre = async (id: string | number): Promise<void> => {
    const res = await axiosPrivate.delete(`/depreciation-settings/${id}`)

    if (!res) {
        throw new Error('fail to delete depreciation')
    }

    return res.data
}