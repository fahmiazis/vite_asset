import { useState } from "react"
import { useTranslation } from "react-i18next"
import * as XLSX from "xlsx"
import type { Asset } from "../../../models/transaction/detailWStages"

// ─── Excel Download (data mulai B2) ──────────────────────────────────────────

function downloadAssetExcel(assets: Asset[], itemName: string) {
  const wb = XLSX.utils.book_new()
  const ws: XLSX.WorkSheet = {}

  // A1 = judul item
  ws["A1"] = { v: itemName, t: "s" }

  // Header di B2 – F2
  const headers = ["No", "Asset Number", "Asset Name", "Asset Status", "GR Status"]
  headers.forEach((h, i) => {
    const col = XLSX.utils.encode_col(1 + i) // B=1, C=2, dst
    ws[`${col}2`] = { v: h, t: "s" }
  })

  // Data mulai B3
  assets.forEach((asset, idx) => {
    const row = 3 + idx
    ws[`B${row}`] = { v: idx + 1, t: "n" }
    ws[`C${row}`] = { v: asset.asset_number ?? "-", t: "s" }
    ws[`D${row}`] = { v: asset.asset_name ?? "-", t: "s" }
    ws[`E${row}`] = { v: asset.asset_status ?? "-", t: "s" }
    ws[`F${row}`] = { v: asset.gr_status ?? "-", t: "s" }
  })

  ws["!ref"] = `A1:F${2 + assets.length}`
  ws["!cols"] = [
    { wch: 4 },
    { wch: 6 },
    { wch: 22 },
    { wch: 30 },
    { wch: 16 },
    { wch: 16 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, "Assets")
  const filename = `assets_${itemName.replace(/\s+/g, "_").toLowerCase()}.xlsx`
  XLSX.writeFile(wb, filename)
}

// ─── Status Badge Helper ──────────────────────────────────────────────────────

function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
    inactive: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600",
    pending: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
    pending_receipt: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
    done: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
    cancelled: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  }
  return map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
}

// ─── Asset List Modal ─────────────────────────────────────────────────────────

function AssetListModal({ assets, itemName, onClose }: {
  assets: Asset[]
  itemName: string
  onClose: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-md mx-4">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("detailTransaction.assetModal.title")}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{itemName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">

          {/* Summary */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t("detailTransaction.assetModal.totalAssets")}
            </span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {assets.length} {t("detailTransaction.assetModal.unit")}
            </span>
          </div>

          {/* List */}
          <div className="space-y-2">
            {assets.map((asset, idx) => (
              <div
                key={asset.id}
                className="flex items-center justify-between px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {asset.asset_number}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{asset.asset_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  {asset.gr_status && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${statusBadgeClass(asset.gr_status)}`}>
                      {asset.gr_status}
                    </span>
                  )}
                  {asset.asset_status && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${statusBadgeClass(asset.asset_status)}`}>
                      {asset.asset_status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t("detailTransaction.assetModal.close")}
          </button>
          <button
            onClick={() => downloadAssetExcel(assets, itemName)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t("detailTransaction.assetModal.downloadExcel")}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Asset Number Cell ────────────────────────────────────────────────────────

export function AssetNumberCell({ assets, itemName }: {
  assets: Asset[]
  itemName: string
}) {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  if (!assets || assets.length === 0) {
    return <p className="text-sm font-medium text-gray-800 dark:text-gray-200">-</p>
  }

  const first = assets[0].asset_number
  const last = assets[assets.length - 1].asset_number
  const rangeText = assets.length === 1 ? first : `${first} – ${last}`

  return (
    <>
      {showModal && (
        <AssetListModal
          assets={assets}
          itemName={itemName}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="flex items-center gap-1.5 flex-wrap">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{rangeText}</p>
        {assets.length > 1 && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
            </svg>
            {t("detailTransaction.assetModal.showAll", { count: assets.length })}
          </button>
        )}
      </div>
    </>
  )
}