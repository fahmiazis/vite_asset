import { axiosPrivate } from "../../libs/instance"

export interface DeleteProcurementResponse {
    status: string
    message: string
    data: null
}

export const deleteProcurement = async (id: string): Promise<DeleteProcurementResponse> => {
    const encodedId = encodeURIComponent(id)
    const response = await axiosPrivate.delete<DeleteProcurementResponse>(
        `/transactions/procurement/?number=${encodedId}`
    )
    return response.data
}