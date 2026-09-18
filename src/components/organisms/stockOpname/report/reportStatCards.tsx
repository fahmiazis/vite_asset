import { useTranslation } from "react-i18next"
import type { StockOpnameDashboardStats } from "../../../../models/stockOpname/report"
import { formatCompactRupiah, formatNumber } from "../../../../utils/format"

function StatCard({ label, value, tone, subLabel }: { label: string; value: string; tone?: string; subLabel?: string }) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4">
      <p className="text-[11px] font-medium text-gray1 uppercase tracking-wide truncate">{label}</p>
      <p className={`text-xl font-bold mt-1 ${tone ?? "text-[var(--text-color)]"}`}>{value}</p>
      {subLabel && <p className="text-[11px] text-gray1 mt-0.5">{subLabel}</p>}
    </div>
  )
}

interface ReportStatCardsProps {
  stats: StockOpnameDashboardStats
}

export function ReportStatCards({ stats }: ReportStatCardsProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
      <StatCard label={t("stockOpnameReportPage.stats.totalAsset", "Total Aset")} value={formatNumber(stats.total_asset)} />
      <StatCard
        label={t("stockOpnameReportPage.stats.finish", "Finish")}
        value={formatNumber(stats.finish)}
        tone="text-green-600 dark:text-green-400"
        subLabel={`${stats.finish_percentage}% ${t("stockOpnameReportPage.stats.done", "selesai")}`}
      />
      <StatCard
        label={t("stockOpnameReportPage.stats.inProgress", "In Progress")}
        value={formatNumber(stats.in_progress)}
        tone="text-blue-600 dark:text-blue-400"
      />
      <StatCard
        label={t("stockOpnameReportPage.stats.belumSubmit", "Belum Submit")}
        value={formatNumber(stats.belum_submit)}
        tone="text-gray-500 dark:text-gray-400"
      />
      <StatCard
        label={t("stockOpnameReportPage.stats.rejected", "Rejected")}
        value={formatNumber(stats.rejected)}
        tone="text-red-600 dark:text-red-400"
      />
      <StatCard
        label={t("stockOpnameReportPage.stats.revisi", "Revisi")}
        value={formatNumber(stats.revisi)}
        tone="text-yellow-600 dark:text-yellow-400"
      />
      <StatCard label={t("stockOpnameReportPage.stats.acquisVal", "Acquis Val")} value={formatCompactRupiah(stats.acquisition_value)} />
      <StatCard label={t("stockOpnameReportPage.stats.bookVal", "Book Val")} value={formatCompactRupiah(stats.book_value)} />
    </div>
  )
}
