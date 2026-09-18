import { useTranslation } from "react-i18next"
import { useBranchList } from "../../../../hooks/query/branch/list"

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

export type ReportView = "dashboard" | "detail"

interface ReportFilterBarProps {
  view: ReportView
  onViewChange: (view: ReportView) => void
  month: number
  year: number
  branchCode: string
  draftMonth: number
  draftYear: number
  draftBranchCode: string
  onDraftMonthChange: (month: number) => void
  onDraftYearChange: (year: number) => void
  onDraftBranchChange: (branchCode: string) => void
  onApply: () => void
  onDownload: () => void
  isDownloading: boolean
  periodLabel?: string
  totalAsset?: number
}

export function ReportFilterBar({
  view,
  onViewChange,
  draftMonth,
  draftYear,
  draftBranchCode,
  onDraftMonthChange,
  onDraftYearChange,
  onDraftBranchChange,
  onApply,
  onDownload,
  isDownloading,
  periodLabel,
  totalAsset,
}: ReportFilterBarProps) {
  const { t } = useTranslation()
  const { data: branchData } = useBranchList()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 3 + i)

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-gray1 whitespace-nowrap">
          {t("stockOpnameReportPage.view", "Tampilan")}:
        </span>
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => onViewChange("dashboard")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              view === "dashboard"
                ? "bg-blue-600 text-white"
                : "text-gray1 hover:text-[var(--text-color)]"
            }`}
          >
            {t("stockOpnameReportPage.dashboard", "Dashboard")}
          </button>
          <button
            onClick={() => onViewChange("detail")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              view === "detail"
                ? "bg-blue-600 text-white"
                : "text-gray1 hover:text-[var(--text-color)]"
            }`}
          >
            {t("stockOpnameReportPage.detailReport", "Detail Report")}
          </button>
        </div>

        <span className="text-xs font-medium text-gray1 whitespace-nowrap ml-2">
          {t("stockOpnameReportPage.period", "Periode")}:
        </span>
        <select
          value={draftMonth}
          onChange={(e) => onDraftMonthChange(Number(e.target.value))}
          className="text-xs border border-gray-200 dark:border-gray-700 bg-transparent rounded-lg px-2.5 py-1.5 outline-none"
        >
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={draftYear}
          onChange={(e) => onDraftYearChange(Number(e.target.value))}
          className="text-xs border border-gray-200 dark:border-gray-700 bg-transparent rounded-lg px-2.5 py-1.5 outline-none"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={onApply}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          {t("stockOpnameReportPage.go", "Go")}
        </button>

        {periodLabel && (
          <span className="text-xs text-gray1 whitespace-nowrap">{periodLabel}</span>
        )}

        <span className="text-xs font-medium text-gray1 whitespace-nowrap ml-2">
          {t("stockOpnameReportPage.plant", "Plant")}:
        </span>
        <select
          value={draftBranchCode}
          onChange={(e) => onDraftBranchChange(e.target.value)}
          className="text-xs border border-gray-200 dark:border-gray-700 bg-transparent rounded-lg px-2.5 py-1.5 outline-none max-w-[180px]"
        >
          <option value="ALL">{t("stockOpnameReportPage.allPlant", "Semua")}</option>
          {branchData?.data.map((b) => (
            <option key={b.branch_code} value={b.branch_code}>
              {b.branch_code} - {b.branch_name}
            </option>
          ))}
        </select>

        {typeof totalAsset === "number" && (
          <span className="text-xs text-gray1 whitespace-nowrap">
            {totalAsset.toLocaleString("id-ID")} {t("stockOpnameReportPage.assetUnit", "aset")}
          </span>
        )}

        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors whitespace-nowrap"
        >
          {isDownloading
            ? t("stockOpnameReportPage.downloading", "Mengunduh...")
            : t("stockOpnameReportPage.downloadReport", "Download Report")}
        </button>
      </div>
    </div>
  )
}
