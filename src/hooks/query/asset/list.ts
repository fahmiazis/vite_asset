import { useQuery } from "@tanstack/react-query"
import type { listAssestProps } from "../../../models/asset/list"
import { assetList, assetViewableBranches } from "../../../services/asset/list"
 
export interface UseAssetListParams {
  page: number
  limit: number
  search?: string
  assetStatus?: string
  branchCode?: string
  categoryId?: number
  /** tunda fetch sampai filter wajibnya siap (mis. menunggu branch homebase) */
  enabled?: boolean
}
 
export const useAssetList = (params: UseAssetListParams) => {
  const { data, isLoading, error, refetch } = useQuery<listAssestProps>({
    queryKey: [
      "asset-list",
      params.page,
      params.limit,
      params.search ?? "",
      params.assetStatus ?? "",
      params.branchCode ?? "",
      params.categoryId ?? "",
    ],
    queryFn: () => assetList(params),
    enabled: params.enabled ?? true,
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  })
 
  return { data, isLoading, error, refetch }
}
export const useAssetViewableBranches = () =>
  useQuery({
    queryKey: ["asset-viewable-branches"],
    queryFn: assetViewableBranches,
  })
