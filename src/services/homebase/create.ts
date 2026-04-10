import { axiosPrivate } from "../../libs/instance"

export interface CreateHomeBasePayload {
    branch_id: string
}

export interface CreateHomeBaseResponse {
    data: null
    message: string
    status: string
}

export const createHomeBase = async (payload: CreateHomeBasePayload): Promise<CreateHomeBaseResponse> => {
    const res = await axiosPrivate.post("/user/homebase/set-active", payload)

    if (!res) {
        throw new Error("fail to create home base")
    }

    return res.data
}