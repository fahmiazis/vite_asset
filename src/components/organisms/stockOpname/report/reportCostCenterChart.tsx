import { useTranslation } from "react-i18next"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { StockOpnameCostCenterRow } from "../../../../models/stockOpname/report"
import { formatCompactRupiah } from "../../../../utils/format"

interface ReportCostCenterChartProps {
  data: StockOpnameCostCenterRow[]
}

export function ReportCostCenterChart({ data }: ReportCostCenterChartProps) {
  const { t } = useTranslation()

  const chartData = data.map((row) => ({
    name: `${row.branch_code} - ${row.branch_name}`,
    acquisition_value: row.acquisition_value,
    book_value: row.book_value,
  }))

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 mt-4">
      <h3 className="text-sm font-semibold text-[var(--text-color)] mb-4">
        {t("stockOpnameReportPage.rekap.costCenterTitle", "Nilai aset per cost center (top 10)")}
      </h3>
      {chartData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-xs text-gray1">
          {t("stockOpnameReportPage.rekap.noData", "Tidak ada data")}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(240, chartData.length * 42)}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
            <XAxis type="number" tickFormatter={(v) => formatCompactRupiah(v)} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={180} />
            <Tooltip formatter={(v) => formatCompactRupiah(Number(v))} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="acquisition_value" fill="#3b82f6" name={t("stockOpnameReportPage.stats.acquisVal", "Acquis Val")} />
            <Bar dataKey="book_value" fill="#10b981" name={t("stockOpnameReportPage.stats.bookVal", "Book Val")} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
