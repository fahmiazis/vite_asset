import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Book01Icon, ArrowRight01Icon } from "hugeicons-react"

const GUIDE_MODULES = [
  {
    key: "stockOpname",
    path: "/dashboard/guide/stock-opname",
    icon: Book01Icon,
  },
  // Modul lain (mutation, disposal, procurement, dst) tinggal ditambahin
  // di sini kalau panduannya udah dibikin.
]

export default function GuidePage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-4 mt-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t("guidePage.title")}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("guidePage.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GUIDE_MODULES.map((mod) => {
          const Icon = mod.icon
          return (
            <Link
              key={mod.key}
              to={mod.path}
              className="group flex items-start gap-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {t(`guidePage.modules.${mod.key}.title`)}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t(`guidePage.modules.${mod.key}.description`)}
                </p>
              </div>
              <ArrowRight01Icon className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
