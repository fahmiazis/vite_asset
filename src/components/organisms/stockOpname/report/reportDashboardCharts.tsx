import { useTranslation } from "react-i18next"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type {
  StockOpnameConditionSummary,
  StockOpnameGroupingStatus,
  StockOpnamePhysicalVsSystem,
  StockOpnameStatusBreakdown,
} from "../../../../models/stockOpname/report"

const STATUS_COLORS = {
  finish: "#10b981",
  in_progress: "#3b82f6",
  belum_submit: "#9ca3af",
  rejected: "#ef4444",
  revisi: "#f59e0b",
  disposal: "#ec4899",
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-[var(--text-color)] mb-4">{title}</h3>
      {children}
    </div>
  )
}

// ---------- Status per grouping (stacked bar) ----------

function useStatusLabels() {
  const { t } = useTranslation()
  return {
    finish: t("stockOpnameReportPage.stats.finish", "Finish"),
    in_progress: t("stockOpnameReportPage.stats.inProgress", "In Progress"),
    belum_submit: t("stockOpnameReportPage.stats.belumSubmit", "Belum Submit"),
    rejected: t("stockOpnameReportPage.stats.rejected", "Rejected"),
    revisi: t("stockOpnameReportPage.stats.revisi", "Revisi"),
    disposal: t("stockOpnameReportPage.stats.disposal", "Disposal"),
  }
}

function StatusPerGroupingChart({ data }: { data: StockOpnameGroupingStatus[] }) {
  const { t } = useTranslation()
  const labels = useStatusLabels()
  const ungroupedLabel = t("stockOpnameReportPage.charts.ungrouped", "Belum Dikelompokkan")
  const chartData = data.map((g) => ({
    grouping: g.grouping || ungroupedLabel,
    finish: g.status.finish,
    in_progress: g.status.in_progress,
    belum_submit: g.status.belum_submit,
    rejected: g.status.rejected,
    disposal: g.status.disposal,
  }))

  return (
    <ChartCard title={t("stockOpnameReportPage.charts.statusPerGrouping", "Status per grouping")}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="grouping" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="finish" stackId="a" fill={STATUS_COLORS.finish} name={labels.finish} />
          <Bar dataKey="in_progress" stackId="a" fill={STATUS_COLORS.in_progress} name={labels.in_progress} />
          <Bar dataKey="belum_submit" stackId="a" fill={STATUS_COLORS.belum_submit} name={labels.belum_submit} />
          <Bar dataKey="rejected" stackId="a" fill={STATUS_COLORS.rejected} name={labels.rejected} />
          <Bar dataKey="disposal" stackId="a" fill={STATUS_COLORS.disposal} name={labels.disposal} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ---------- Status fisik vs SAP ----------

function PhysicalVsSystemChart({ data }: { data: StockOpnamePhysicalVsSystem }) {
  const { t } = useTranslation()
  const chartData = [
    { name: t("stockOpnameReportPage.charts.statusFisik", "Status Fisik"), ada: data.physical_ada, tidak_ada: data.physical_tidak_ada },
    { name: t("stockOpnameReportPage.charts.statusSap", "Status SAP"), ada: data.system_ada, tidak_ada: data.system_tidak_ada },
  ]

  return (
    <ChartCard title={t("stockOpnameReportPage.charts.physicalVsSystem", "Status fisik vs SAP")}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="ada" fill="#10b981" name={t("stockOpnameReportPage.charts.ada", "Ada")} />
          <Bar dataKey="tidak_ada" fill="#ef4444" name={t("stockOpnameReportPage.charts.tidakAda", "Tidak Ada")} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ---------- Donut helpers ----------

function DonutChart({ segments }: { segments: { name: string; value: number; color: string }[] }) {
  const { t } = useTranslation()
  const nonZero = segments.filter((s) => s.value > 0)
  if (nonZero.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-xs text-gray1">
        {t("stockOpnameReportPage.rekap.noData", "Tidak ada data")}
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={nonZero} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} strokeWidth={0}>
          {nonZero.map((s, i) => (
            <Cell key={i} fill={s.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function ConditionSummaryChart({ data }: { data: StockOpnameConditionSummary }) {
  const { t } = useTranslation()
  return (
    <ChartCard title={t("stockOpnameReportPage.charts.conditionSummary", "Kondisi aset")}>
      <DonutChart
        segments={[
          { name: t("stockOpnameReportPage.charts.baik", "Baik"), value: data.baik, color: "#10b981" },
          { name: t("stockOpnameReportPage.charts.rusak", "Rusak"), value: data.rusak, color: "#ef4444" },
          { name: t("stockOpnameReportPage.charts.tidakAda", "Tidak Ada"), value: data.tidak_ada, color: "#f59e0b" },
          { name: t("stockOpnameReportPage.charts.belumIsi", "Belum Isi"), value: data.belum_isi, color: "#9ca3af" },
        ]}
      />
    </ChartCard>
  )
}

function StatusSubmitChart({ data }: { data: StockOpnameStatusBreakdown }) {
  const { t } = useTranslation()
  const labels = useStatusLabels()
  return (
    <ChartCard title={t("stockOpnameReportPage.charts.statusSubmit", "Status submit")}>
      <DonutChart
        segments={[
          { name: `${labels.finish} (${data.finish})`, value: data.finish, color: STATUS_COLORS.finish },
          { name: `${labels.in_progress} (${data.in_progress})`, value: data.in_progress, color: STATUS_COLORS.in_progress },
          { name: `${labels.belum_submit} (${data.belum_submit})`, value: data.belum_submit, color: STATUS_COLORS.belum_submit },
          { name: `${labels.rejected} (${data.rejected})`, value: data.rejected, color: STATUS_COLORS.rejected },
          { name: `${labels.revisi} (${data.revisi})`, value: data.revisi, color: STATUS_COLORS.revisi },
          { name: `${labels.disposal} (${data.disposal})`, value: data.disposal, color: STATUS_COLORS.disposal },
        ]}
      />
    </ChartCard>
  )
}

interface ReportDashboardChartsProps {
  statusPerGrouping: StockOpnameGroupingStatus[]
  physicalVsSystem: StockOpnamePhysicalVsSystem
  conditionSummary: StockOpnameConditionSummary
  statusSubmit: StockOpnameStatusBreakdown
}

export function ReportDashboardCharts({
  statusPerGrouping,
  physicalVsSystem,
  conditionSummary,
  statusSubmit,
}: ReportDashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <StatusPerGroupingChart data={statusPerGrouping} />
      <PhysicalVsSystemChart data={physicalVsSystem} />
      <ConditionSummaryChart data={conditionSummary} />
      <StatusSubmitChart data={statusSubmit} />
    </div>
  )
}
