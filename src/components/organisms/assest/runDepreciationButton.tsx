import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Calculator01Icon } from "hugeicons-react"
import { useRunDepreciation } from "../../../hooks/mutation/depreciation/run"
import { useRunDepreciationAllowed } from "../../../hooks/query/depreciation/runAllowed"
import { useSingleSubmit } from "../../../hooks/useSingleSubmit"

/** YYYY-MM dari tanggal lokal */
function currentPeriod(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

/**
 * Tombol "Run Depreciation" di halaman Asset. Hanya dirender untuk user yang
 * punya hak akses `run_depreciation` di menu "Asset Run Depreciation".
 *
 * Scheduler backend sudah menghitung otomatis tiap tanggal 1 untuk bulan
 * sebelumnya; tombol ini untuk menghitung lebih awal (mis. bulan berjalan,
 * supaya dashboard terisi). Aset yang sudah dihitung di period itu dilewati,
 * jadi aman ditekan ulang.
 */
export function RunDepreciationButton() {
  const { t } = useTranslation()
  const allowed = useRunDepreciationAllowed()
  const [open, setOpen] = useState(false)
  const [period, setPeriod] = useState(currentPeriod)
  const { run, isPending } = useRunDepreciation({ onSuccess: () => setOpen(false) })
  const guard = useSingleSubmit(isPending)

  if (!allowed) return null

  const max = currentPeriod()

  return (
    <>
      <button
        onClick={() => {
          setPeriod(currentPeriod())
          setOpen(true)
        }}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap"
      >
        <Calculator01Icon size={15} />
        {t("runDepreciation.button")}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t("runDepreciation.title")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("runDepreciation.description")}</p>
            </div>

            <label className="flex flex-col gap-1.5 text-sm text-gray-700 dark:text-gray-300">
              {t("runDepreciation.period")}
              <input
                type="month"
                value={period}
                max={max}
                onChange={(e) => setPeriod(e.target.value)}
                disabled={isPending}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <p className="text-xs text-gray-500 dark:text-gray-400">{t("runDepreciation.note")}</p>

            <div className="flex gap-2">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {t("runDepreciation.cancel")}
              </button>
              <button
                onClick={guard(() => run(period))}
                disabled={isPending || !period || period > max}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? t("runDepreciation.running") : t("runDepreciation.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
