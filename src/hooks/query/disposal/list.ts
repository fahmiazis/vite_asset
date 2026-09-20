import { useQuery } from "@tanstack/react-query"
import type { disposalListProps } from "../../../models/disposal/list"
import { disposalList, type DisposalListParams } from "../../../services/disposal/list"

export type UseDisposalListParams = DisposalListParams

export const useDisposalList = (params: UseDisposalListParams) => {
  const { data, isLoading, error, refetch } = useQuery<disposalListProps>({
    queryKey: ["disposal-list", params],
    queryFn: () => disposalList(params),
    placeholderData: (prev) => prev,
  })

  return { data, isLoading, error, refetch }
}
