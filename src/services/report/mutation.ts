import { axiosPrivate } from "../../libs/instance"
import type { ReportFilterParams } from "../../models/report/common"
import type { MutationReportResponse } from "../../models/report/mutation"
import { cleanReportParams } from "./common"

export const mutationReport = async (params: ReportFilterParams): Promise<MutationReportResponse> => {
  const res = await axiosPrivate.get("/reports/mutation", { params: cleanReportParams(params) })

  if (!res) {
    throw new Error("fail to get mutation report")
  }

  return res.data
}
