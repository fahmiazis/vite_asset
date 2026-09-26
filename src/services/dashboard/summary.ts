import { axiosPrivate } from "../../libs/instance"
import type { DashboardSummaryResponse } from "../../models/dashboard"

export const dashboardSummary = async (): Promise<DashboardSummaryResponse> => {
  const res = await axiosPrivate.get("/dashboard/summary")

  if (!res) {
    throw new Error("fail to get dashboard summary")
  }

  return res.data
}
