import { useQuery } from "@tanstack/react-query"
import type { disposalListProps } from "../../../models/disposal/list"
import { disposalList } from "../../../services/disposal/list"

export interface UseDisposalListParams {
  page: number
  limit: number
  search?: string
}

export const useDisposalList = (params: UseDisposalListParams) => {
  const { data, isLoading, error, refetch } = useQuery<disposalListProps>({
    queryKey: ["disposal-list", params.page, params.limit, params.search ?? ""],
    queryFn: () => disposalList(params),
    placeholderData: (prev) => prev, 
  })

  return { data, isLoading, error, refetch }
}