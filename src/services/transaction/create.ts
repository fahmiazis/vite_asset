import { axiosPrivate } from "../../libs/instance";
import type { ProcurementPayload, ProcurementResponse } from "../../models/transaction/create";

export const createProcurement = async (payload: ProcurementPayload): Promise<ProcurementResponse> => {
    const response = await axiosPrivate.post<ProcurementResponse>('/transactions/procurement', payload);
    return response.data;
}