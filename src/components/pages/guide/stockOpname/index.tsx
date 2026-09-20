import type { ComponentType } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft01Icon,
  Route01Icon,
  Rocket01Icon,
  PencilEdit01Icon,
  GridTableIcon,
  BookDownloadIcon,
  CheckmarkBadge01Icon,
  Target01Icon,
  Cancel01Icon,
  ChartUpIcon,
  Settings01Icon,
} from "hugeicons-react"

type GuideIcon = ComponentType<{ className?: string }>

interface GuideSection {
  title: string
  summary: string
  steps: string[]
  tip?: string
}

const SECTION_IDS = [
  "overview",
  "createDraft",
  "fillSingle",
  "fillGrid",
  "fillExcel",
  "submitApproval",
  "execute",
  "reject",
  "report",
  "config",
] as const

const SECTION_ICONS: Record<(typeof SECTION_IDS)[number], GuideIcon> = {
  overview: Route01Icon,
  createDraft: Rocket01Icon,
  fillSingle: PencilEdit01Icon,
  fillGrid: GridTableIcon,
  fillExcel: BookDownloadIcon,
  submitApproval: CheckmarkBadge01Icon,
  execute: Target01Icon,
  reject: Cancel01Icon,
  report: ChartUpIcon,
  config: Settings01Icon,
}

export default function StockOpnameGuidePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section className="space-y-4 mt-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/guide")}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors flex-shrink-0"
        >
          <ArrowLeft01Icon className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t("guideStockOpname.title")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("guideStockOpname.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 items-start">
        {/* Daftar isi */}
        <div className="lg:sticky lg:top-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
            {t("guideStockOpname.toc")}
          </p>
          <nav className="space-y-0.5">
            {SECTION_IDS.map((id) => {
              const Icon = SECTION_ICONS[id]
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{t(`guideStockOpname.sections.${id}.title`)}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Konten */}
        <div className="space-y-4">
          {SECTION_IDS.map((id) => {
            const Icon = SECTION_ICONS[id]
            const section = t(`guideStockOpname.sections.${id}`, { returnObjects: true }) as GuideSection

            return (
              <div
                key={id}
                id={id}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 scroll-mt-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{section.title}</h3>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{section.summary}</p>

                <ol className="space-y-2 mb-3">
                  {section.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-medium flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                {section.tip && (
                  <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg px-3 py-2">
                    {section.tip}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
