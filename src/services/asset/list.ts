import { axiosPrivate } from "../../libs/instance";
import type { listAssestProps } from "../../models/asset/list";

export interface AssetListParams {
  page: number
  limit: number
  search?: string
  /** AVAILABLE, IN_DISPOSAL, dst — dto.AssetListFilter.asset_status */
  assetStatus?: string
  /** batasi ke satu cabang — dto.AssetListFilter.branch_code */
  branchCode?: string
}

export const assetList = async (params: AssetListParams): Promise<listAssestProps> => {
  const { page, limit, search, assetStatus, branchCode } = params

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
    ...(assetStatus ? { asset_status: assetStatus } : {}),
    ...(branchCode ? { branch_code: branchCode } : {}),
  })

  const res = await axiosPrivate.get(`/assets?${query.toString()}`)

  if (!res) {
    throw new Error("fail to get list assets")
  }

  return res.data
}