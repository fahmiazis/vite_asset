import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useReviseStockOpname } from "../../../hooks/mutation/stockOpname/revise"
import { useStockOpnameApprovalStatus } from "../../../hooks/query/stockOpname/approvalStatus"
import type { StockOpnameItem } from "../../../models/stockOpname/detail"
import type { ReviseStockOpnameMode } from "../../../models/stockOpname/revise"

type ReviseStockOpnameModalProps = {
  transactionNumber: string
  items: StockOpnameItem[]
  mode: ReviseStockOpnameMode
  onClose: () => void
  onSuccess?: () => void
}

const MIN_NOTES_LENGTH = 5

export function ReviseStockOpnameModal({
  transactionNumber,
  items,
  mode,
  onClose,
  onSuccess,
}: ReviseStockOpnameModalProps) {
  const { t } = useTranslation()
  const [notes, setNotes] = useState("")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const { mutate: reviseStockOpname, isPending } = useReviseStockOpname({ transactionNumber, mode })

  // Revisi dari approver harus nyebut step approval yang lagi pending —
  // sama kayak approveModal
  const { data: approvalData } = useStockOpnameApprovalStatus(mode === "approval" ? transactionNumber : "")
  const pendingApprovalId =
    approvalData?.data.approvals.find((a) => a.status?.toLowerCase() === "pending")?.id ?? ""
  const approvalReady = mode !== "approval" || !!pendingApprovalId

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter(
      (item) =>
        item.asset_number.toLowerCase().includes(query) ||
        (item.asset_name ?? "").toLowerCase().includes(query)
    )
  }, [items, search])

  const isNotesValid = notes.trim().length >= MIN_NOTES_LENGTH
  const allFilteredSelected = filteredItems.length > 0 && filteredItems.every((item) => selected.has(item.asset_id))

  const toggleItem = (assetId: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(assetId)) next.delete(assetId)
      else next.add(assetId)
      return next
    })
  }

  const toggleAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      for (const item of filteredItems) {
        if (allFilteredSelected) next.delete(item.asset_id)
        else next.add(item.asset_id)
      }
      return next
    })
  }

  const submit = (reviseAll: boolean) => {
    if (!isNotesValid || !approvalReady) return
    if (!reviseAll && selected.size === 0) return

    reviseStockOpname(
      {
        asset_ids: reviseAll ? [] : Array.from(selected),
        revise_all: reviseAll,
        revision_notes: notes.trim(),
        transaction_approval_id: pendingApprovalId,
      },
      {
        onSuccess: () => {
          onSuccess?.()
          onClose()
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("reviseStockOpnameModal.title")}
            </h3>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {transactionNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
              </svg>
            </div>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              {t("reviseStockOpnameModal.warningMessage")}
            </p>
          </div>

          {/* Checklist asset */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                {t("reviseStockOpnameModal.assetsLabel")}
              </label>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {t("reviseStockOpnameModal.selectedCount", { count: selected.size, total: items.length })}
              </span>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("reviseStockOpnameModal.searchPlaceholder")}
              disabled={isPending}
              className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            />

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <label className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleAllFiltered}
                  disabled={isPending || filteredItems.length === 0}
                  className="w-3.5 h-3.5 rounded accent-amber-600"
                />
                <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                  {t("reviseStockOpnameModal.checkAllShown")}
                </span>
              </label>

              <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {filteredItems.length === 0 ? (
                  <p className="px-3 py-6 text-center text-xs text-gray-400">
                    {t("reviseStockOpnameModal.noAssetsFound")}
                  </p>
                ) : (
                  filteredItems.map((item) => (
                    <label
                      key={item.asset_id}
                      className={`flex items-start gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
                        selected.has(item.asset_id)
                          ? "bg-amber-50/70 dark:bg-amber-900/10"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(item.asset_id)}
                        onChange={() => toggleItem(item.asset_id)}
                        disabled={isPending}
                        className="w-3.5 h-3.5 mt-0.5 rounded accent-amber-600"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                          {item.asset_name ?? "-"}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">{item.asset_number}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("reviseStockOpnameModal.notesLabel")} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("reviseStockOpnameModal.notesPlaceholder")}
              disabled={isPending}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none transition-all disabled:opacity-50"
            />
            {notes.length > 0 && !isNotesValid && (
              <p className="text-xs text-red-500">
                {t("reviseStockOpnameModal.notesTooShort", {
                  min: MIN_NOTES_LENGTH,
                  current: notes.trim().length,
                })}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t("reviseStockOpnameModal.cancel")}
          </button>

          <div className="flex flex-1 gap-2 justify-end min-w-0">
            <button
              onClick={() => submit(true)}
              disabled={isPending || !isNotesValid || !approvalReady}
              className="px-4 py-2 text-sm font-medium border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("reviseStockOpnameModal.reviseAll")}
            </button>

            <button
              onClick={() => submit(false)}
              disabled={isPending || !isNotesValid || !approvalReady || selected.size === 0}
              className="px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? t("reviseStockOpnameModal.revising")
                : t("reviseStockOpnameModal.reviseSelected", { count: selected.size })}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
