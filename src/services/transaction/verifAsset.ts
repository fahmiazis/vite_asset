import { axiosPrivate } from "../../libs/instance"

export interface SubmitProcurementPayload {
    notes?: string
}

export interface SubmitProcurementResponse {
    status: string
    message: string
    data: null
}

export const submitProcurement = async (
    id: string,
    payload: SubmitProcurementPayload
): Promise<SubmitProcurementResponse> => {
    const encodedId = encodeURIComponent(id)
    const response = await axiosPrivate.post<SubmitProcurementResponse>(
        `/transactions/procurement/submit?transaction_number=${encodedId}`,
        payload
    )
    return response.data
}