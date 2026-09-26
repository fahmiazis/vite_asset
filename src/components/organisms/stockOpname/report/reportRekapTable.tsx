import { useTranslation } from "react-i18next"
import type { StockOpnameAreaSummary, StockOpnameRekapRow } from "../../../../models/stockOpname/report"
import { formatNumber, formatRupiah } from "../../../../utils/format"

function ValueCell({ value }: { value: number }) {
  return <td className="px-4 py-2.5 text-right text-xs whitespace-nowrap">{formatRupiah(value)}</td>
}

const BOLD_ROWS = new Set([
  "Total Rekonsiliasi Hasil Opname AREA NASIONAL & HO TGR NON IT",
  "Total Area yang tidak kirim",
])

interface ReportRekapTableProps {
  rekap: StockOpnameRekapRow[]
  areaSummary: StockOpnameAreaSummary
  note: string
}

export function ReportRekapTable({ rekap, areaSummary, note }: ReportRekapTableProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray1 uppercase tracking-wide">
                {t("stockOpnameReportPage.rekap.label", "Rekapitulasi")}
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray1 uppercase tracking-wide">Acquis.val.</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray1 uppercase tracking-wide">Accum.dep.</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray1 uppercase tracking-wide">Book val.</th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray1 uppercase tracking-wide">
                {t("stockOpnameReportPage.rekap.unitInfo", "Unit / Info")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rekap.map((row) => {
              const bold = BOLD_ROWS.has(row.label)
              return (
                <tr
                  key={row.label}
                  className={bold ? "bg-gray-50 dark:bg-gray-900/50 font-semibold" : ""}
                >
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                    {row.label}
                    {!row.supported && (
                      <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                        {t("stockOpnameReportPage.rekap.unsupported", "belum didukung")}
                      </span>
                    )}
                  </td>
                  <ValueCell value={row.acquisition_value} />
                  <ValueCell value={row.accumulated_depreciation} />
                  <ValueCell value={row.book_value} />
                  <td className="px-4 py-2.5 text-right text-xs text-gray1 whitespace-nowrap">
                    {row.extra_info ??
                      (row.unit_count > 0
                        ? `${formatNumber(row.unit_count)} ${t("stockOpnameReportPage.rekap.unit", "unit")}`
                        : "-")}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="rounded-xl bg-green-50 dark:bg-green-950/40 p-3 text-center">
          <p className="text-[11px] text-green-700 dark:text-green-400 font-medium">
            {t("stockOpnameReportPage.rekap.areaClear", "Area Clear")}
          </p>
          <p className="text-lg font-bold text-green-700 dark:text-green-400">
            {areaSummary.area_clear_count} ({areaSummary.area_clear_percentage}%)
          </p>
        </div>
        <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-center">
          <p className="text-[11px] text-red-700 dark:text-red-400 font-medium">
            {t("stockOpnameReportPage.rekap.areaNotClear", "Area Tidak Clear")}
          </p>
          <p className="text-lg font-bold text-red-700 dark:text-red-400">
            {areaSummary.area_not_clear_count} ({areaSummary.area_not_clear_percentage}%)
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-3 text-center">
          <p className="text-[11px] text-gray1 font-medium">
            {t("stockOpnameReportPage.rekap.totalArea", "Total Area Nasional")}
          </p>
          <p className="text-lg font-bold text-[var(--text-color)]">{areaSummary.total_area} (100%)</p>
        </div>
      </div>

      <p className="text-[11px] text-gray1 mt-4 leading-relaxed">{note}</p>
    </div>
  )
}
