import { useQuery } from "@tanstack/react-query"
import type { stockOpnameConfigProps } from "../../../models/stockOpname/config"
import { getStockOpnameConfig } from "../../../services/stockOpname/config"

export const useStockOpnameConfig = () => {
  const { data, isLoading, error, refetch } = useQuery<stockOpnameConfigProps>({
    queryKey: ["stock-opname-config"],
    queryFn: getStockOpnameConfig,
  })

  return { data, isLoading, error, refetch }
}
