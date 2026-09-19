import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useStockOpnameDetail } from "../../../../hooks/query/stockOpname/detail"
import { useBulkUpdateStockOpnameFinding } from "../../../../hooks/mutation/stockOpname/bulkUpdateFinding"
import { StockOpnameFillGridRow, type FillFieldName, type FillRowState } from "../../../organisms/stockOpname/fillGridRow"
import type { BulkUpdateStockOpnameFindingItem } from "../../../../models/stockOpname/bulkUpdateFinding"

const AUTOSAVE_INTERVAL_MS = 8000

type SaveStatus = "idle" | "saving" | "saved" | "error"

function emptyRowState(): FillRowState {
  return { physical_status: "", condition: "", asset_status: "", notes: "" }
}

export default function StockOpnameFillPage() {
  const { "*": id } = useParams()
  const transactionNumber = id ?? ""
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data, isLoading } = useStockOpnameDetail(transactionNumber)
  const { mutateAsync: bulkUpdate } = useBulkUpdateStockOpnameFinding({ transactionNumber })

  const [rows, setRows] = useState<Record<number, FillRowState>>({})
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({})
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const pendingRef = useRef<Record<number, Partial<BulkUpdateStockOpnameFindingItem>>>({})
  const initializedRef = useRef(false)
  const flushingRef = useRef(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const items = useMemo(() => data?.data?.items ?? [], [data])
  const transaction = data?.data?.transaction
  const isDraft = transaction?.current_stage === "DRAFT"

  // Ctrl/Cmd+F fokus ke search box di halaman ini alih-alih native
  // find-in-page browser — lebih kepake karena beneran filter baris grid,
  // bukan cuma highlight teks. Esc di dalam search box buat clear + blur.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return items
    return items.filter(
      (item) =>
        item.asset_number.toLowerCase().includes(query) ||
        (item.asset_name ?? "").toLowerCase().includes(query)
    )
  }, [items, searchQuery])

  const assetNumberToId = useMemo(() => {
    const map: Record<string, number> = {}
    for (const item of items) map[item.asset_number] = item.asset_id
    return map
  }, [items])

  // Seed local editable state cuma sekali dari data awal — setelah itu
  // `rows` jadi source of truth, gak ditimpa ulang tiap query refetch
  // (autosave sukses bikin query invalidated), biar input yg lagi diketik
  // gak keganti data server.
  useEffect(() => {
    if (initializedRef.current || items.length === 0) return
    const initial: Record<number, FillRowState> = {}
    for (const item of items) {
      initial[item.asset_id] = {
        physical_status: item.found_physical_status ?? "",
        condition: item.found_condition ?? "",
        asset_status: item.found_asset_status ?? "",
        notes: item.notes ?? "",
      }
    }
    setRows(initial)
    initializedRef.current = true
  }, [items])

  const handleFieldChange = useCallback((assetId: number, field: FillFieldName, rawValue: string) => {
    setRows((prev) => {
      const current = prev[assetId] ?? emptyRowState()
      const next: FillRowState = { ...current, [field]: rawValue }
      const patch: Partial<BulkUpdateStockOpnameFindingItem> = { [field]: rawValue }

      // Fisik "Tidak Ada" -> Kondisi otomatis "Tidak Ada" & terkunci.
      // Balik ke "Ada" -> Kondisi direset kosong biar dipilih ulang.
      if (field === "physical_status") {
        if (rawValue === "MISSING") {
          next.condition = "NOT_APPLICABLE"
          patch.condition = "NOT_APPLICABLE"
        } else if (current.condition === "NOT_APPLICABLE") {
          next.condition = ""
          patch.condition = ""
        }
      }

      pendingRef.current[assetId] = { ...pendingRef.current[assetId], ...patch }
      return { ...prev, [assetId]: next }
    })

    setRowErrors((prev) => (prev[assetId] ? { ...prev, [assetId]: "" } : prev))
  }, [])

  const flush = useCallback(async () => {
    if (flushingRef.current) return
    const pending = pendingRef.current
    const assetIds = Object.keys(pending).map(Number)
    if (assetIds.length === 0) return

    pendingRef.current = {}
    flushingRef.current = true
    setSaveStatus("saving")

    try {
      const res = await bulkUpdate({
        items: assetIds.map((assetId) => ({ asset_id: assetId, ...pending[assetId] })),
      })
      const result = res.data

      setRowErrors((prev) => {
        const next = { ...prev }
        for (const assetId of assetIds) next[assetId] = ""
        for (const err of result.errors) {
          const assetId = assetNumberToId[err.asset_number]
          if (assetId) next[assetId] = err.message
        }
        return next
      })

      setSaveStatus(result.failed_count > 0 ? "error" : "saved")
      setLastSavedAt(new Date())
    } catch {
      // request-level failure (network/server) — taruh balik ke pending
      // biar dicoba lagi di tick berikutnya, gabung sama perubahan baru
      // yang mungkin udah masuk selama request tadi berjalan
      pendingRef.current = { ...pending, ...pendingRef.current }
      setSaveStatus("error")
    } finally {
      flushingRef.current = false
    }
  }, [bulkUpdate, assetNumberToId])

  useEffect(() => {
    const interval = setInterval(flush, AUTOSAVE_INTERVAL_MS)
    return () => {
      clearInterval(interval)
      flush()
    }
  }, [flush])

  const hasPending = Object.keys(pendingRef.current).length > 0
  const errorCount = Object.values(rowErrors).filter(Boolean).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  if (!data?.data || !transaction) return null

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(`/dashboard/stock-opname/${transactionNumber}`)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {t("stockOpnameFillPage.title")}
            </h1>
            <p className="text-[11px] text-gray-400 font-mono truncate">{transactionNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1 max-w-sm">
          <div className="relative flex-1">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchQuery("")
                  searchInputRef.current?.blur()
                }
              }}
              placeholder={t("stockOpnameFillPage.searchPlaceholder")}
              className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-950"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
              {filteredItems.length} / {items.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <SaveStatusBadge status={saveStatus} errorCount={errorCount} lastSavedAt={lastSavedAt} hasPending={hasPending} t={t} />
          <button
            onClick={flush}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            {t("stockOpnameFillPage.saveNow")}
          </button>
        </div>
      </div>

      {/* Body */}
      {!isDraft ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-gray-400 text-center max-w-sm">{t("stockOpnameFillPage.notDraft")}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-gray-400">{t("stockOpnameDetail.noAssets")}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-gray-400">{t("stockOpnameFillPage.searchNoResults")}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900 shadow-sm">
              <tr>
                {[
                  t("stockOpnameFillPage.columnNo"),
                  t("stockOpnamePhoto.label"),
                  t("stockOpnameFillPage.columnAsset"),
                  t("stockOpnameFillPage.columnCategory"),
                  t("stockOpnameFillPage.columnPhysicalStatus"),
                  t("stockOpnameFillPage.columnCondition"),
                  t("stockOpnameFillPage.columnAssetStatus"),
                  t("stockOpnameFillPage.columnNotes"),
                  "",
                ].map((label, i) => (
                  <th
                    key={i}
                    className="border border-gray-200 dark:border-gray-800 px-2 py-2 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <StockOpnameFillGridRow
                  key={item.asset_id}
                  index={index}
                  transactionNumber={transactionNumber}
                  item={item}
                  state={rows[item.asset_id] ?? emptyRowState()}
                  error={rowErrors[item.asset_id]}
                  t={t}
                  onFieldChange={handleFieldChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SaveStatusBadge({
  status,
  errorCount,
  lastSavedAt,
  hasPending,
  t,
}: {
  status: SaveStatus
  errorCount: number
  lastSavedAt: Date | null
  hasPending: boolean
  t: ReturnType<typeof useTranslation>["t"]
}) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        {t("stockOpnameFillPage.statusSaving")}
      </span>
    )
  }
  if (status === "error" && errorCount > 0) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        {errorCount} {t("stockOpnameFillPage.statusErrorSuffix")}
      </span>
    )
  }
  if (status === "saved" || lastSavedAt) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
        <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${hasPending ? "animate-pulse" : ""}`} />
        {t("stockOpnameFillPage.statusSaved")}
        {lastSavedAt && ` • ${lastSavedAt.toLocaleTimeString("id-ID")}`}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-400">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
      {t("stockOpnameFillPage.statusIdle")}
    </span>
  )
}
