import { useQuery } from "@tanstack/react-query"
import type { stockOpnameListProps } from "../../../models/stockOpname/list"
import { stockOpnameList, type StockOpnameListParams } from "../../../services/stockOpname/list"

export const useStockOpnameList = (params: StockOpnameListParams) => {
  const { data, isLoading, error, refetch } = useQuery<stockOpnameListProps>({
    queryKey: ["stock-opname-list", params.page, params.limit, params.status ?? "", params.current_stage ?? ""],
    queryFn: () => stockOpnameList(params),
    placeholderData: (prev) => prev,
  })

  return { data, isLoading, error, refetch }
}
