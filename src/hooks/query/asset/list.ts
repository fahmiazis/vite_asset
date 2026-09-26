import { useQuery } from "@tanstack/react-query"
import type { listAssestProps } from "../../../models/asset/list"
import { assetList } from "../../../services/asset/list"
 
export interface UseAssetListParams {
  page: number
  limit: number
  search?: string
  assetStatus?: string
  branchCode?: string
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
    ],
    queryFn: () => assetList(params),
    enabled: params.enabled ?? true,
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  })
 
  return { data, isLoading, error, refetch }
}