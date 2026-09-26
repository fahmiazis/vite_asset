import { useQuery } from "@tanstack/react-query"
import type { DashboardSummaryResponse } from "../../../models/dashboard"
import { dashboardSummary } from "../../../services/dashboard/summary"

export const useDashboardSummary = () => {
  const { data, isLoading, error } = useQuery<DashboardSummaryResponse>({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardSummary,
  })

  return { data, isLoading, error }
}
