import { axiosPrivate } from "../../libs/instance";
import type { detailApprovalFlowProps } from "../../models/approval/detail";
export const approvalFlowDetail = async (id: string): Promise<detailApprovalFlowProps> => {
    const res = await axiosPrivate.get(`/approval-flows/${id}`)

    if (!res) {
        throw new Error('fail to get detail approval flow')
    }

    const data = await res.data
    return data
}