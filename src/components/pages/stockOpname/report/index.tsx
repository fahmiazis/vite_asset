import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useStockOpnameReportDashboard } from "../../../../hooks/query/stockOpname/reportDashboard"
import { useStockOpnameReportDetail } from "../../../../hooks/query/stockOpname/reportDetail"
import { useStockOpnameReportExport } from "../../../../hooks/mutation/stockOpname/reportExport"
import { ReportFilterBar, type ReportView } from "../../../../components/organisms/stockOpname/report/reportFilterBar"
import { ReportStatCards } from "../../../../components/organisms/stockOpname/report/reportStatCards"
import { ReportDashboardCharts } from "../../../../components/organisms/stockOpname/report/reportDashboardCharts"
import { ReportRekapTable } from "../../../../components/organisms/stockOpname/report/reportRekapTable"
import { ReportCostCenterChart } from "../../../../components/organisms/stockOpname/report/reportCostCenterChart"

function formatDateShort(value: string) {
  return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })
}

export default function StockOpnameReportPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const now = new Date()
  const [view, setView] = useState<ReportView>("dashboard")

  const [appliedMonth, setAppliedMonth] = useState(now.getMonth() + 1)
  const [appliedYear, setAppliedYear] = useState(now.getFullYear())
  const [appliedBranchCode, setAppliedBranchCode] = useState("ALL")

  const [draftMonth, setDraftMonth] = useState(appliedMonth)
  const [draftYear, setDraftYear] = useState(appliedYear)
  const [draftBranchCode, setDraftBranchCode] = useState(appliedBranchCode)

  const filterParams = {
    month: appliedMonth,
    year: appliedYear,
    branch_code: appliedBranchCode,
  }

  const { data: dashboardData, isLoading: isDashboardLoading } = useStockOpnameReportDashboard(filterParams)
  const { data: detailData, isLoading: isDetailLoading } = useStockOpnameReportDetail(filterParams, view === "detail")
  const { exportReport, isExporting } = useStockOpnameReportExport()

  const handleApply = () => {
    setAppliedMonth(draftMonth)
    setAppliedYear(draftYear)
    setAppliedBranchCode(draftBranchCode)
  }

  const handleDownload = () => {
    exportReport(filterParams)
  }

  const period = dashboardData?.data.period
  const periodLabel = period ? `${formatDateShort(period.start_date)} – ${formatDateShort(period.end_date)}` : undefined

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h6 className="text-3xl font-bold">{t("stockOpnameReportPage.title", "Report Stock Opname")}</h6>
        <button
          onClick={() => navigate("/dashboard/stock-opname")}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {t("stockOpnameReportPage.backToList", "Kembali ke daftar")}
        </button>
      </div>

      <ReportFilterBar
        view={view}
        onViewChange={setView}
        month={appliedMonth}
        year={appliedYear}
        branchCode={appliedBranchCode}
        draftMonth={draftMonth}
        draftYear={draftYear}
        draftBranchCode={draftBranchCode}
        onDraftMonthChange={setDraftMonth}
        onDraftYearChange={setDraftYear}
        onDraftBranchChange={setDraftBranchCode}
        onApply={handleApply}
        onDownload={handleDownload}
        isDownloading={isExporting}
        periodLabel={periodLabel}
        totalAsset={dashboardData?.data.stats.total_asset}
      />

      {view === "dashboard" ? (
        isDashboardLoading && !dashboardData ? (
          <LoadingState />
        ) : dashboardData ? (
          <>
            <ReportStatCards stats={dashboardData.data.stats} />
            <ReportDashboardCharts
              statusPerGrouping={dashboardData.data.charts.status_per_grouping}
              physicalVsSystem={dashboardData.data.charts.physical_vs_system}
              conditionSummary={dashboardData.data.charts.condition_summary}
              statusSubmit={dashboardData.data.charts.status_submit}
            />
          </>
        ) : null
      ) : isDetailLoading && !detailData ? (
        <LoadingState />
      ) : detailData ? (
        <>
          <ReportRekapTable
            rekap={detailData.data.rekap}
            areaSummary={detailData.data.area_summary}
            note={detailData.data.note}
          />
          <ReportCostCenterChart data={detailData.data.cost_centers_top10} />
        </>
      ) : null}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto" />
        <p className="mt-4 text-sm text-gray1">Memuat laporan...</p>
      </div>
    </div>
  )
}
