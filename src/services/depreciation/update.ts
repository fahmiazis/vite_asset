import { axiosPrivate } from "../../libs/instance";

export interface UpdateDeprePayload {
    useful_life_months: number
    depreciation_rate: number | null
    end_date: string | null
    is_active: boolean
}

export const updateDepre = async (id: string | number, payload: UpdateDeprePayload) => {
    const res = await axiosPrivate.put(`/depreciation-settings/${id}`, payload)

    if (!res) {
        throw new Error('fail to update depreciation')
    }

    return res.data
}