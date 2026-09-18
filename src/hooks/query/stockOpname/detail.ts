import { useQuery } from "@tanstack/react-query"
import type { stockOpnameDetailProps } from "../../../models/stockOpname/detail"
import { stockOpnameDetail } from "../../../services/stockOpname/detail"

export const useStockOpnameDetail = (transactionNumber: string) => {
  const { data, isLoading, error, refetch } = useQuery<stockOpnameDetailProps>({
    queryKey: ["stock-opname-detail", transactionNumber],
    queryFn: () => stockOpnameDetail(transactionNumber),
    enabled: !!transactionNumber,
  })

  return { data, isLoading, error, refetch }
}
