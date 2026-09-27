import { useQuery } from "@tanstack/react-query"
import type { stockOpnamePhysicalStatusMasterListProps } from "../../../models/stockOpname/statusMaster"
import { getStockOpnamePhysicalStatusMasters } from "../../../services/stockOpname/statusMaster"

export const useStockOpnamePhysicalStatusMasters = () => {
  const { data, isLoading, error, refetch } = useQuery<stockOpnamePhysicalStatusMasterListProps>({
    queryKey: ["stock-opname-physical-status-masters"],
    queryFn: getStockOpnamePhysicalStatusMasters,
  })

  return { data, isLoading, error, refetch }
}
