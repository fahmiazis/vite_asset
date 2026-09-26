import { axiosPrivate } from "../../libs/instance"
import type { ReportFilterParams } from "../../models/report/common"

/** jenis report = segmen terakhir endpoint /reports/:type */
export type ReportType = "procurement" | "mutation" | "disposal"

/** parameter kosong tidak dikirim, supaya backend membaca "semua" */
export function cleanReportParams(params: ReportFilterParams): ReportFilterParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ) as ReportFilterParams
}

function extractFilename(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) return fallback
  const match = contentDisposition.match(/filename="?([^";]+)"?/i)
  return match?.[1]?.trim() || fallback
}

/**
 * Unduh excel dengan filter yang sama persis dengan tabel di layar —
 * endpoint-nya sama, hanya ditambah format=xlsx.
 */
export const downloadReportExcel = async (type: ReportType, params: ReportFilterParams): Promise<void> => {
  const res = await axiosPrivate.get(`/reports/${type}`, {
    params: { ...cleanReportParams(params), format: "xlsx" },
    responseType: "blob",
  })

  if (!res) {
    throw new Error(`fail to export ${type} report`)
  }

  const filename = extractFilename(res.headers["content-disposition"], `${type}-report.xlsx`)
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
