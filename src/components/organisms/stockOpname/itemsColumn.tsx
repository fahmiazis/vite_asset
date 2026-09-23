import type { ColumnDef } from "@tanstack/react-table"
import type { TFunction } from "i18next"
import type { StockOpnameItem } from "../../../models/stockOpname/detail"
import { StockOpnamePhotoViewCell } from "./photoViewCell"
import { StockOpnameBorrowDocumentViewCell } from "./borrowDocumentViewCell"

export function AssetStatusBadge({ status }: { status?: string | null }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
    AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
    INACTIVE: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
    RETIRED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
    DISPOSED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  }
  const key = status?.toUpperCase() ?? "INACTIVE"
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${map[key] ?? map["INACTIVE"]}`}>
      {status ?? "-"}
    </span>
  )
}

function CompactFindingCell({
  physicalStatus,
  condition,
  assetStatus,
  variant,
  t,
}: {
  physicalStatus?: string | null
  condition?: string | null
  assetStatus?: string | null
  variant: "system" | "found"
  t: TFunction
}) {
  const textColor = variant === "found" ? "text-indigo-700 dark:text-indigo-300 font-medium" : "text-gray-600 dark:text-gray-300"
  return (
    <div className="space-y-0.5 text-[11px] leading-tight">
      <div className={textColor}>
        <span className="text-gray-400 dark:text-gray-500">{t("stockOpnameDetail.physicalStatus")}:</span>{" "}
        {physicalStatus ?? "-"}
      </div>
      <div className={textColor}>
        <span className="text-gray-400 dark:text-gray-500">{t("stockOpnameDetail.condition")}:</span>{" "}
        {condition ?? "-"}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-gray-400 dark:text-gray-500">{t("stockOpnameDetail.assetStatus")}:</span>
        <AssetStatusBadge status={assetStatus} />
      </div>
    </div>
  )
}

interface GetStockOpnameItemColumnsParams {
  t: TFunction
  isDraft: boolean
  onFillFinding: (item: StockOpnameItem) => void
}

export function getStockOpnameItemColumns({
  t,
  isDraft,
  onFillFinding,
}: GetStockOpnameItemColumnsParams): ColumnDef<StockOpnameItem>[] {
  const columns: ColumnDef<StockOpnameItem>[] = [
    {
      id: "no",
      header: t("stockOpnameDetail.tableNo"),
      size: 40,
      cell: ({ row }) => (
        <span className="text-xs text-gray-400">{row.index + 1}</span>
      ),
    },
    {
      id: "photo",
      header: t("stockOpnamePhoto.label"),
      cell: ({ row }) => (
        <StockOpnamePhotoViewCell photoUrl={row.original.photo_url} capturedAt={row.original.photo_captured_at} />
      ),
    },
    {
      id: "borrow_document",
      header: t("stockOpnameFillPage.columnBorrowDocument"),
      cell: ({ row }) => (
        <StockOpnameBorrowDocumentViewCell
          fileName={row.original.borrow_document_file_name}
          documentUrl={row.original.borrow_document_url}
        />
      ),
    },
    {
      id: "asset",
      header: t("stockOpnameDetail.tableAsset"),
      cell: ({ row }) => (
        <div>
          <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
            {row.original.asset_name ?? "-"}
          </p>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">{row.original.asset_number}</p>
        </div>
      ),
    },
    {
      accessorKey: "category_name",
      id: "category_name",
      header: t("stockOpnameDetail.tableCategory"),
      cell: ({ row }) => (
        <span className="text-xs text-gray-600 dark:text-gray-300">{row.original.category_name ?? "-"}</span>
      ),
    },
    {
      id: "system_data",
      header: t("stockOpnameDetail.systemData"),
      cell: ({ row }) => (
        <CompactFindingCell
          physicalStatus={row.original.system_physical_status}
          condition={row.original.system_condition}
          assetStatus={row.original.system_asset_status}
          variant="system"
          t={t}
        />
      ),
    },
    {
      id: "found_data",
      header: t("stockOpnameDetail.foundResult"),
      cell: ({ row }) => (
        <CompactFindingCell
          physicalStatus={row.original.found_physical_status}
          condition={row.original.found_condition}
          assetStatus={row.original.found_asset_status}
          variant="found"
          t={t}
        />
      ),
    },
    {
      accessorKey: "notes",
      id: "notes",
      header: t("stockOpnameDetail.tableNotes"),
      cell: ({ row }) => (
        <p
          className="text-xs text-gray-500 dark:text-gray-400 italic max-w-[160px] truncate"
          title={row.original.notes ?? ""}
        >
          {row.original.notes ? `"${row.original.notes}"` : "-"}
        </p>
      ),
    },
  ]

  if (isDraft) {
    columns.push({
      id: "aksi",
      header: t("stockOpnameDetail.tableAction"),
      cell: ({ row }) => (
        <button
          onClick={() => onFillFinding(row.original)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {row.original.found_physical_status ? t("stockOpnameDetail.editFinding") : t("stockOpnameDetail.fillFinding")}
        </button>
      ),
    })
  }

  return columns
}
