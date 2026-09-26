import { useState } from "react"
import { useTranslation } from "react-i18next"
import { CheckListIcon, Clock01Icon, Menu01Icon, PencilEdit02Icon } from "hugeicons-react"
import { useDisposalList } from "../../../hooks/query/disposal/list"
import ListHeader from "../../organisms/common/listHeader"
import { StatCards } from "../../organisms/common/statCards"
import { DisposalTable, type DisposalFilters } from "../../organisms/disposal/table"
import { defaultDateRange } from "../../../utils/dateRange"

const PAGE_SIZE = 10

/** hanya membaca `total`, jadi cukup ambil satu baris per hitungan */
const COUNT_ONLY = { page: 1, limit: 1 }

/**
 * Tab pengajuan, dikelompokkan menurut tahap kerja — bukan satu tab per stage,
 * supaya user langsung melihat "yang masih butuh diproses" tanpa hafal nama
 * stage. Backend menerima beberapa stage sekaligus dipisah koma.
 */
const STAGE_TABS = [
  { key: "all", stages: "" },
  // Tab ini tidak memfilter stage — backend yang menentukan mana yang
  // menunggu user, dari hak akses role + cabang yang dia punya
  { key: "waiting", stages: "" },
  { key: "draft", stages: "DRAFT" },
  { key: "approval", stages: "APPROVAL_REQUEST,APPROVAL_AGREEMENT" },
  { key: "process", stages: "PURCHASING,EXECUTE,FINANCE,TAX,ASSET_DELETION" },
  { key: "finished", stages: "FINISHED" },
  { key: "closed", stages: "REJECTED,CANCELLED" },
] as const

/**
 * Filter awal: rentang dua bulan (awal bulan kemarin s/d akhir bulan berjalan).
 * Tanpa rentang default, halaman memuat seluruh riwayat dan yang relevan
 * tenggelam di antara transaksi lama.
 */
const initialFilters = (): DisposalFilters => ({
  disposal_type: "",
  status: "",
  current_stage: "",
  search: "",
  ...defaultDateRange(),
})

export default function DisposalPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [filters, setFilters] = useState<DisposalFilters>(initialFilters)

  const activeStages = STAGE_TABS.find((tab) => tab.key === activeTab)?.stages ?? ""
  const waitingOnly = activeTab === "waiting"

  const { data, isLoading } = useDisposalList({
    page,
    limit: PAGE_SIZE,
    disposal_type: filters.disposal_type || undefined,
    status: filters.status || undefined,
    // tab menentukan stage; dropdown stage di tabel dihapus supaya tidak ada
    // dua kontrol yang mengatur hal yang sama
    current_stage: activeStages || undefined,
    waiting_for_me: waitingOnly || undefined,
    search: filters.search || undefined,
    start_date: filters.start_date || undefined,
    end_date: filters.end_date || undefined,
  })

  // Ringkasan dihitung server-side per stage. Rentang tanggal ikut dikirim
  // supaya angkanya menggambarkan periode yang sama dengan isi tabel — kalau
  // tidak, tab bisa menulis "12" padahal yang tampil hanya 3. Filter lain
  // (tipe, pencarian) sengaja TIDAK ikut, supaya ringkasannya tidak berubah
  // setiap kali user mengetik.
  const countBase = {
    ...COUNT_ONLY,
    start_date: filters.start_date || undefined,
    end_date: filters.end_date || undefined,
  }

  const all = useDisposalList(countBase)
  const draft = useDisposalList({ ...countBase, current_stage: "DRAFT" })
  const approval = useDisposalList({
    ...countBase,
    current_stage: "APPROVAL_REQUEST,APPROVAL_AGREEMENT",
  })
  const process = useDisposalList({
    ...countBase,
    current_stage: "PURCHASING,EXECUTE,FINANCE,TAX,ASSET_DELETION",
  })
  const finished = useDisposalList({ ...countBase, current_stage: "FINISHED" })
  const waiting = useDisposalList({ ...countBase, waiting_for_me: true })
  const closed = useDisposalList({
    ...countBase,
    current_stage: "REJECTED,CANCELLED",
  })

  const allCount = all.data?.data.total ?? 0
  const isLoadingStats =
    all.isLoading || draft.isLoading || approval.isLoading || finished.isLoading

  const tabCounts: Record<string, number> = {
    all: allCount,
    waiting: waiting.data?.data.total ?? 0,
    draft: draft.data?.data.total ?? 0,
    approval: approval.data?.data.total ?? 0,
    process: process.data?.data.total ?? 0,
    finished: finished.data?.data.total ?? 0,
    closed: closed.data?.data.total ?? 0,
  }

  const share = (value: number) =>
    allCount > 0
      ? t("listStats.ofTotal", { percent: Math.round((value / allCount) * 100) })
      : undefined

  const stats = [
    {
      color: "gray" as const,
      icon: <Menu01Icon size={15} />,
      value: allCount,
      label: t("listStats.total"),
    },
    {
      color: "gray" as const,
      icon: <PencilEdit02Icon size={15} />,
      value: tabCounts.draft,
      label: t("listStats.draft"),
      hint: share(tabCounts.draft),
    },
    {
      color: "yellow" as const,
      icon: <Clock01Icon size={15} />,
      value: tabCounts.approval,
      label: t("listStats.onApproval"),
      hint: share(tabCounts.approval),
    },
    {
      color: "green" as const,
      icon: <CheckListIcon size={15} />,
      value: tabCounts.finished,
      label: t("listStats.finished"),
      hint: share(tabCounts.finished),
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-2 rounded-xl">
      <ListHeader
        title={t("disposalList.title")}
        subtitle={t("disposalList.subtitle", { count: allCount })}
        createHref="/dashboard/disposal/create"
        createLabel={t("disposalList.create")}
      />

      <StatCards items={stats} isLoading={isLoadingStats} />

      {/* Tab pengajuan — menggantikan dropdown stage di tabel */}
      <div className="flex items-center gap-1 px-4 md:px-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {STAGE_TABS.map((tab) => {
          const active = activeTab === tab.key

          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key)
                setPage(1) // tab berganti → mulai dari halaman pertama
              }}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                active
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {t(`disposalList.tab.${tab.key}`)}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                  tab.key === "waiting" && (tabCounts.waiting ?? 0) > 0
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                    : active
                      ? "bg-indigo-50 dark:bg-indigo-900/40"
                      : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {tabCounts[tab.key] ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      <DisposalTable
        data={data?.data.data ?? []}
        total={data?.data.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        filters={filters}
        onPageChange={setPage}
        onFiltersChange={(next) => {
          setFilters(next)
          setPage(1) // reset ke halaman 1 tiap filter berubah
        }}
        onResetFilters={() => {
          setFilters(initialFilters())
          setPage(1)
        }}
      />
    </div>
  )
}
