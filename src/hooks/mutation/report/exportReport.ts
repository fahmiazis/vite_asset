import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import type { ReportFilterParams } from "../../../models/report/common"
import { downloadReportExcel, type ReportType } from "../../../services/report/common"

export const useReportExport = (type: ReportType) => {
  const { t } = useTranslation()
  const { mutate, isPending } = useMutation({
    mutationFn: (params: ReportFilterParams) => downloadReportExcel(type, params),
    onSuccess: () => {
      toast.success(t("transactionReport.downloadSuccess"))
    },
    onError: () => {
      toast.error(t("transactionReport.downloadFailed"))
    },
  })

  return { exportReport: mutate, isExporting: isPending }
}
