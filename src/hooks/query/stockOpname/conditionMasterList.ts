import { useQuery } from "@tanstack/react-query"
import type { stockOpnameConditionMasterListProps } from "../../../models/stockOpname/statusMaster"
import { getStockOpnameConditionMasters } from "../../../services/stockOpname/statusMaster"

export const useStockOpnameConditionMasters = () => {
  const { data, isLoading, error, refetch } = useQuery<stockOpnameConditionMasterListProps>({
    queryKey: ["stock-opname-condition-masters"],
    queryFn: getStockOpnameConditionMasters,
  })

  return { data, isLoading, error, refetch }
}
