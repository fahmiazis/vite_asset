import { axiosPrivate } from "../../libs/instance"
import type { StockOpnameReportFilterParams } from "../../models/stockOpname/report"

function extractFilename(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) return fallback
  const match = contentDisposition.match(/filename="?([^"；;]+)"?/i)
  return match?.[1]?.trim() || fallback
}

export const stockOpnameReportExport = async (params: StockOpnameReportFilterParams): Promise<void> => {
  const res = await axiosPrivate.get("/transactions/stock-opname/report/export", {
    params,
    responseType: "blob",
  })

  if (!res) {
    throw new Error("fail to export stock opname report")
  }

  const filename = extractFilename(res.headers["content-disposition"], "stock_opname_report.xlsx")
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
