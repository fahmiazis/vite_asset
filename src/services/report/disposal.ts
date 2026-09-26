import { axiosPrivate } from "../../libs/instance"
import type { ReportFilterParams } from "../../models/report/common"
import type { DisposalReportResponse } from "../../models/report/disposal"
import { cleanReportParams } from "./common"

export const disposalReport = async (params: ReportFilterParams): Promise<DisposalReportResponse> => {
  const res = await axiosPrivate.get("/reports/disposal", { params: cleanReportParams(params) })

  if (!res) {
    throw new Error("fail to get disposal report")
  }

  return res.data
}
