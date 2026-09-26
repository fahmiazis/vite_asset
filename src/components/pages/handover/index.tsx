import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Search01Icon } from "hugeicons-react"
import ListHeader from "../../organisms/common/listHeader"
import { ListTabs } from "../../organisms/common/listTabs"
import { DateRangeFilter } from "../../organisms/common/dateRangeFilter"
import { RevisionBadge } from "../../organisms/common/revisionBadge"
import { HandoverStageBadge, HandoverTypeBadge } from "../../organisms/handover/badges"
import { useHandoverList } from "../../../hooks/query/handover"
import { defaultDateRange } from "../../../utils/dateRange"
import type { HandoverType } from "../../../constans/handover"

const PAGE_SIZE = 10
const COUNT_ONLY = { page: 1, limit: 1 }

// Tab disaring server-side; "Menunggu Saya" dihitung backend (handover_waiting.go)
const STAGE_TABS = [
  { key: "all", stages: "" },
  { key: "waiting", stages: "" },
  { key: "draft", stages: "DRAFT" },
  { key: "approval", stages: "APPROVAL" },
  { key: "receiving", stages: "HANDOVER_RECEIVING" },
  { key: "finished", stages: "FINISHED" },
  { key: "closed", stages: "REJECTED,CANCELLED" },
] as const

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

export default function HandoverPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [handoverType, setHandoverType] = useState<HandoverType | "">("")
  const [dateRange, setDateRange] = useState(defaultDateRange)

  const activeStages = STAGE_TABS.find((tab) => tab.key === activeTab)?.stages ?? ""
  const filters = { handover_type: handoverType, search, ...dateRange }

  const { data, isLoading } = useHandoverList({
    page,
    limit: PAGE_SIZE,
    current_stage: activeStages || undefined,
    waiting_for_me: activeTab === "waiting" || undefined,
    ...filters,
  })

  // angka tab dihitung server per tab, dengan filter yang sama
  const countBase = { ...COUNT_ONLY, ...filters }
  const counts: Record<string, number> = {
    all: useHandoverList(countBase).data?.data?.total ?? 0,
    waiting: useHandoverList({ ...countBase, waiting_for_me: true }).data?.data?.total ?? 0,
    draft: useHandoverList({ ...countBase, current_stage: "DRAFT" }).data?.data?.total ?? 0,
    approval: useHandoverList({ ...countBase, current_stage: "APPROVAL" }).data?.data?.total ?? 0,
    receiving: useHandoverList({ ...countBase, current_stage: "HANDOVER_RECEIVING" }).data?.data?.total ?? 0,
    finished: useHandoverList({ ...countBase, current_stage: "FINISHED" }).data?.data?.total ?? 0,
    closed: useHandoverList({ ...countBase, current_stage: "REJECTED,CANCELLED" }).data?.data?.total ?? 0,
  }

  const tabs = STAGE_TABS.map((tab) => ({
    label: t(`handover.tabs.${tab.key}`),
    value: tab.key,
    count: counts[tab.key] ?? 0,
  }))

  const rows = data?.data?.data ?? []
  const total = data?.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setPage(1)
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-2 rounded-xl">
      <ListHeader
        title={t("handover.title")}
        subtitle={t("handover.subtitle", { count: counts.all })}
        createHref="/dashboard/handover/create"
        createLabel={t("handover.create")}
      />

      <ListTabs tabs={tabs} activeTab={activeTab} onChange={resetPage(setActiveTab)} />

      <div className="p-4 space-y-4">
        <section className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search01Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => resetPage(setSearch)(e.target.value)}
              placeholder={t("handover.searchPlaceholder")}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 max-w-full"
            />
          </div>
          <select
            value={handoverType}
            onChange={(e) => resetPage(setHandoverType)(e.target.value as HandoverType | "")}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          >
            <option value="">{t("handover.allTypes")}</option>
            <option value="HANDOVER">{t("handover.type.HANDOVER")}</option>
            <option value="RETURN">{t("handover.type.RETURN")}</option>
          </select>
          <DateRangeFilter {...dateRange} onChange={resetPage(setDateRange)} />
        </section>

        <div className={`rounded-xl border border-gray-200 dark:border-gray-800 overflow-x-auto ${isLoading ? "opacity-60" : ""}`}>
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">{t("handover.column.number")}</th>
                <th className="px-4 py-3">{t("handover.column.type")}</th>
                <th className="px-4 py-3">{t("handover.column.recipient")}</th>
                <th className="px-4 py-3">{t("handover.column.assets")}</th>
                <th className="px-4 py-3">{t("handover.column.stage")}</th>
                <th className="px-4 py-3">{t("handover.column.createdBy")}</th>
                <th className="px-4 py-3">{t("handover.column.date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    {isLoading ? t("handover.loading") : t("handover.empty")}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.transaction_number}
                    onClick={() => navigate(`/dashboard/handover/${row.transaction_number}`)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  >
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{row.transaction_number}</p>
                      <RevisionBadge show={row.needs_revision} />
                    </td>
                    <td className="px-4 py-3"><HandoverTypeBadge type={row.handover_type} /></td>
                    <td className="px-4 py-3">
                      {row.handover_type === "RETURN" ? (
                        <span className="text-gray-500">{t("handover.branch", { code: row.branch_code })}</span>
                      ) : (
                        row.to_user_name ?? "-"
                      )}
                    </td>
                    <td className="px-4 py-3">{row.total_assets}</td>
                    <td className="px-4 py-3"><HandoverStageBadge stage={row.current_stage} /></td>
                    <td className="px-4 py-3">{row.created_by_name ?? row.created_by}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(row.transaction_date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{t("handover.pageInfo", { page, pages: totalPages, total })}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40"
            >
              {t("handover.prev")}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40"
            >
              {t("handover.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
