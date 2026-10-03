import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CheckListIcon, Clock01Icon, Menu01Icon, PlayCircleIcon } from "hugeicons-react"
import { useStockOpnameList } from "../../../hooks/query/stockOpname/list"
import { StockOpnameTable } from "../../organisms/stockOpname/table"
import { StatCards } from "../../organisms/common/statCards"
import { defaultDateRange } from "../../../utils/dateRange"

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 400

/**
 * Tab penyaring stock opname — disaring server-side, sama dengan halaman
 * procurement. "Menunggu Saya" ditentukan backend dari giliran approval &
 * hak eksekusi user yang sedang login.
 */
const STAGE_TABS = [
  { key: "all", stages: "" },
  { key: "waiting", stages: "" },
  { key: "draft", stages: "DRAFT" },
  { key: "approval", stages: "APPROVAL" },
  { key: "execute", stages: "EXECUTE_STOCK_OPNAME" },
  { key: "finished", stages: "FINISHED" },
  { key: "rejected", stages: "REJECTED" },
] as const

/** query khusus penghitung tab/kartu — cukup total, barisnya tidak dipakai */
const COUNT_ONLY = { page: 1, limit: 1 }

export default function StockOpnamePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [dateRange, setDateRange] = useState(defaultDateRange)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  // Search dikirim ke server, jadi di-debounce biar gak nembak tiap ketikan.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Filter berubah → balik ke halaman 1, kalau nggak bisa nyangkut di
  // halaman yang udah gak ada datanya.
  useEffect(() => {
    setPage(1)
  }, [activeTab, dateRange, search])

  const activeStages = STAGE_TABS.find((tab) => tab.key === activeTab)?.stages ?? ""
  const waitingOnly = activeTab === "waiting"

  const { data, isLoading } = useStockOpnameList({
    page,
    limit: PAGE_SIZE,
    current_stage: activeStages || undefined,
    waiting_for_me: waitingOnly || undefined,
    search: search || undefined,
    ...dateRange,
  })

  // Penghitung ikut rentang tanggal & pencarian supaya angka tab dan kartu
  // menggambarkan data yang sama dengan isi tabel.
  const countBase = { ...COUNT_ONLY, ...dateRange, search: search || undefined }

  const all = useStockOpnameList(countBase)
  const waiting = useStockOpnameList({ ...countBase, waiting_for_me: true })
  const draft = useStockOpnameList({ ...countBase, current_stage: "DRAFT" })
  const approval = useStockOpnameList({ ...countBase, current_stage: "APPROVAL" })
  const execute = useStockOpnameList({ ...countBase, current_stage: "EXECUTE_STOCK_OPNAME" })
  const finished = useStockOpnameList({ ...countBase, current_stage: "FINISHED" })
  const rejected = useStockOpnameList({ ...countBase, current_stage: "REJECTED" })

  const counts: Record<string, number> = {
    all: all.data?.data.total ?? 0,
    waiting: waiting.data?.data.total ?? 0,
    draft: draft.data?.data.total ?? 0,
    approval: approval.data?.data.total ?? 0,
    execute: execute.data?.data.total ?? 0,
    finished: finished.data?.data.total ?? 0,
    rejected: rejected.data?.data.total ?? 0,
  }

  const tabs = STAGE_TABS.map((tab) => ({
    label: t(`stockOpnamePage.tabs.${tab.key}`),
    value: tab.key,
    count: counts[tab.key] ?? 0,
  }))

  const isLoadingStats =
    all.isLoading || approval.isLoading || execute.isLoading || finished.isLoading

  const share = (value: number) =>
    counts.all > 0
      ? t("listStats.ofTotal", { percent: Math.round((value / counts.all) * 100) })
      : undefined

  const stats = [
    {
      color: "gray" as const,
      icon: <Menu01Icon size={15} />,
      value: counts.all,
      label: t("listStats.total"),
    },
    {
      color: "yellow" as const,
      icon: <Clock01Icon size={15} />,
      value: counts.approval,
      label: t("listStats.onApproval"),
      hint: share(counts.approval),
    },
    {
      color: "gray" as const,
      icon: <PlayCircleIcon size={15} />,
      value: counts.execute,
      label: t("stockOpnamePage.stats.execute"),
      hint: share(counts.execute),
    },
    {
      color: "green" as const,
      icon: <CheckListIcon size={15} />,
      value: counts.finished,
      label: t("listStats.finished"),
      hint: share(counts.finished),
    },
  ]

  const resetFilters = () => {
    setDateRange(defaultDateRange())
    setSearchInput("")
    setSearch("")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h6 className="text-3xl font-bold">{t("stockOpnamePage.title")}</h6>
        {/* Config / Master Status / Report pindah ke sidebar */}
        <button
          onClick={() => navigate("/dashboard/stock-opname/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          {t("stockOpnamePage.createButton")}
        </button>
      </div>

      <StatCards items={stats} isLoading={isLoadingStats} className="!px-0" />

      <StockOpnameTable
        data={data?.data.data ?? []}
        total={data?.data.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        onPageChange={setPage}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={searchInput}
        onSearchChange={setSearchInput}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onResetFilters={resetFilters}
      />
    </div>
  )
}
