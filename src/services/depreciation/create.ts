import { axiosPrivate } from "../../libs/instance"
import type { CreateDepreciationFormValues } from "../../components/organisms/depreciation/create" // sesuaikan path

export interface CreateDepreciationResponse {
    status: string
    message: string
    data: null
}

export const createDepreciation = async (
    payload: CreateDepreciationFormValues
): Promise<CreateDepreciationResponse> => {
    const response = await axiosPrivate.post<CreateDepreciationResponse>(
        "/depreciation-settings",
        payload
    )
    return response.data
}