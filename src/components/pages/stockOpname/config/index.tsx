import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useStockOpnameConfig } from "../../../../hooks/query/stockOpname/config"
import { useUpdateStockOpnameConfig } from "../../../../hooks/mutation/stockOpname/updateConfig"

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

export default function StockOpnameConfigPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data, isLoading } = useStockOpnameConfig()
  const { mutate: updateConfig, isPending } = useUpdateStockOpnameConfig()

  const [startDay, setStartDay] = useState(25)
  const [endDay, setEndDay] = useState(8)

  useEffect(() => {
    if (data?.data) {
      setStartDay(data.data.submission_start_day)
      setEndDay(data.data.submission_end_day)
    }
  }, [data])

  const isWrapping = endDay < startDay

  const handleSave = () => {
    updateConfig({ submission_start_day: startDay, submission_end_day: endDay })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  return (
    <section className="space-y-4 mt-4 max-w-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/stock-opname")}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("stockOpnameConfigPage.title")}</h1>
          <p className="text-sm text-gray-400">{t("stockOpnameConfigPage.subtitle")}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t("stockOpnameConfigPage.windowSectionTitle")}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("stockOpnameConfigPage.startDayLabel")}
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={startDay}
              onChange={(e) => setStartDay(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("stockOpnameConfigPage.endDayLabel")}
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={endDay}
              onChange={(e) => setEndDay(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
        </div>

        <p className="text-xs text-gray-400">{t("stockOpnameConfigPage.hint")}</p>
        {isWrapping && (
          <p className="text-xs text-indigo-500 dark:text-indigo-400">{t("stockOpnameConfigPage.wrapHint")}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <p className="text-[11px] text-gray-400">
            {t("stockOpnameConfigPage.lastUpdated")}:{" "}
            {data?.data.updated_by
              ? formatDateTime(data.data.updated_at)
              : t("stockOpnameConfigPage.notYetUpdated")}
          </p>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {isPending ? t("stockOpnameConfigPage.saving") : t("stockOpnameConfigPage.save")}
          </button>
        </div>
      </div>
    </section>
  )
}
