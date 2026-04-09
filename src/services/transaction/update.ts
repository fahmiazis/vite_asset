// services/transaction/update.ts

import { axiosPrivate } from "../../libs/instance";

export interface UpdateProcurementPayload {
    transaction_date: string
    notes: string
    items: {
        item_name: string
        category_id: number
        quantity: number
        unit_price: number
        branch_code: string
        notes: string
        details?: {
            branch_code: string
            quantity: number
            requester_name: string
            notes: string
        }[]
    }[]
}

export interface UpdateProcurementResponse {
    status: string
    message: string
    data: null
}

export const updateProcurement = async (
    id: string,
    payload: UpdateProcurementPayload
): Promise<UpdateProcurementResponse> => {
    const encodedId = id.split("/").map(encodeURIComponent).join("/")
    const response = await axiosPrivate.put<UpdateProcurementResponse>(
        `/transactions/procurement/detail-stage?transaction_number${encodedId}`,
        payload
    )
    return response.data
}