import { axiosPrivate } from "../../libs/instance";
import type { disposalListProps } from "../../models/disposal/list";

export interface DisposalListParams {
  page: number
  limit: number
  search?: string
}

export const disposalList = async (params: DisposalListParams): Promise<disposalListProps> => {
  const { page, limit, search } = params

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  })

  const res = await axiosPrivate.get(`/transactions/disposal?${query.toString()}`)

  if (!res) {
    throw new Error("fail to get list disposal")
  }

  return res.data
}