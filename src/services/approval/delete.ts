import { axiosPrivate } from "../../libs/instance"

export const deleteApprovalFlow = async (id: string) => {
  const response = await axiosPrivate.delete(`/approval-flows/${id}`)
  return response.data
}
