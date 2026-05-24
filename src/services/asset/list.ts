import { axiosPrivate } from "../../libs/instance";
import type { listAssestProps } from "../../models/asset/list";

export interface AssetListParams {
  page: number
  limit: number
  search?: string
}

export const assetList = async (params: AssetListParams): Promise<listAssestProps> => {
  const { page, limit, search } = params

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  })

  const res = await axiosPrivate.get(`/assets?${query.toString()}`)

  if (!res) {
    throw new Error("fail to get list assets")
  }

  return res.data
}