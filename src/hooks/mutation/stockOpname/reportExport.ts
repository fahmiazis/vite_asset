import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import type { StockOpnameReportFilterParams } from "../../../models/stockOpname/report"
import { stockOpnameReportExport } from "../../../services/stockOpname/reportExport"

export const useStockOpnameReportExport = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (params: StockOpnameReportFilterParams) => stockOpnameReportExport(params),
    onSuccess: () => {
      toast.success("Laporan berhasil diunduh")
    },
    onError: () => {
      toast.error("Gagal mengunduh laporan")
    },
  })

  return { exportReport: mutate, isExporting: isPending }
}
