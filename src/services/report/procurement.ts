import { axiosPrivate } from "../../libs/instance"
import type { ReportFilterParams } from "../../models/report/common"
import type { ProcurementReportResponse } from "../../models/report/procurement"
import { cleanReportParams } from "./common"

export const procurementReport = async (params: ReportFilterParams): Promise<ProcurementReportResponse> => {
  const res = await axiosPrivate.get("/reports/procurement", { params: cleanReportParams(params) })

  if (!res) {
    throw new Error("fail to get procurement report")
  }

  return res.data
}
