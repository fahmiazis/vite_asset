import { memo } from "react"
import type { TFunction } from "i18next"
import {
  getPhysicalStatusOptions,
  getConditionOptions,
  getAssetStatusOptions,
  isConditionLocked,
  requiresBorrowDocument,
} from "./findingOptions"
import { PhotoUploadField } from "./photoUploadField"
import { BorrowDocumentUploadField } from "./borrowDocumentUploadField"
import type { StockOpnameItem } from "../../../models/stockOpname/detail"
import type { StockOpnamePhysicalStatusMaster } from "../../../models/stockOpname/statusMaster"

export interface FillRowState {
  physical_status: string
  condition: string
  asset_status: string
  notes: string
}

export type FillFieldName = "physical_status" | "condition" | "asset_status" | "notes"

interface StockOpnameFillGridRowProps {
  index: number
  transactionNumber: string
  item: StockOpnameItem
  state: FillRowState
  error?: string
  t: TFunction
  physicalStatusMasters: StockOpnamePhysicalStatusMaster[]
  onFieldChange: (assetId: number, field: FillFieldName, value: string) => void
  onBorrowDocumentUploaded: (assetId: number) => void
}

const cellClass = "border border-gray-200 dark:border-gray-800 px-2 py-1 align-top"
const inputClass =
  "w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-sm px-1 py-0.5"

function StockOpnameFillGridRowInner({
  index,
  transactionNumber,
  item,
  state,
  error,
  t,
  physicalStatusMasters,
  onFieldChange,
  onBorrowDocumentUploaded,
}: StockOpnameFillGridRowProps) {
  const isBorrowed = requiresBorrowDocument(physicalStatusMasters, state.physical_status)
  const conditionOptions = getConditionOptions(physicalStatusMasters, state.physical_status)
  const conditionLocked = isConditionLocked(physicalStatusMasters, state.physical_status)

  return (
    <tr
      className={
        error
          ? "bg-red-50/70 dark:bg-red-900/10"
          : index % 2 === 0
          ? "bg-white dark:bg-gray-950"
          : "bg-gray-50/60 dark:bg-gray-900/30"
      }
    >
      <td className={`${cellClass} text-center text-[11px] text-gray-400 w-10`}>{index + 1}</td>
      <td className={`${cellClass} w-14`}>
        <PhotoUploadField
          transactionNumber={transactionNumber}
          assetId={item.asset_id}
          photoUrl={item.photo_url}
          capturedAt={item.photo_captured_at}
          variant="grid"
        />
      </td>
      <td className={`${cellClass} min-w-[170px]`}>
        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{item.asset_name ?? "-"}</p>
        <p className="text-[10px] text-gray-400 font-mono">{item.asset_number}</p>
      </td>
      <td className={`${cellClass} text-xs text-gray-600 dark:text-gray-300 min-w-[110px]`}>
        {item.category_name ?? "-"}
      </td>
      <td className={`${cellClass} min-w-[100px]`}>
        <select
          value={state.physical_status}
          onChange={(e) => onFieldChange(item.asset_id, "physical_status", e.target.value)}
          className={inputClass}
        >
          <option value="">{t("stockOpnameFillPage.selectPlaceholder")}</option>
          {getPhysicalStatusOptions(physicalStatusMasters).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </td>
      <td className={`${cellClass} w-14`}>
        {isBorrowed ? (
          <BorrowDocumentUploadField
            transactionNumber={transactionNumber}
            assetId={item.asset_id}
            fileName={item.borrow_document_file_name}
            documentUrl={item.borrow_document_url}
            onUploaded={() => onBorrowDocumentUploaded(item.asset_id)}
          />
        ) : (
          <span className="block text-center text-gray-300 dark:text-gray-700">-</span>
        )}
      </td>
      <td className={`${cellClass} min-w-[100px]`}>
        <select
          value={state.condition}
          onChange={(e) => onFieldChange(item.asset_id, "condition", e.target.value)}
          disabled={!state.physical_status || conditionLocked}
          className={`${inputClass} disabled:opacity-50`}
        >
          <option value="">{t("stockOpnameFillPage.selectPlaceholder")}</option>
          {conditionOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </td>
      <td className={`${cellClass} min-w-[110px]`}>
        <select
          value={state.asset_status}
          onChange={(e) => onFieldChange(item.asset_id, "asset_status", e.target.value)}
          className={inputClass}
        >
          {getAssetStatusOptions(t).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </td>
      <td className={`${cellClass} min-w-[200px]`}>
        <input
          type="text"
          value={state.notes}
          onChange={(e) => onFieldChange(item.asset_id, "notes", e.target.value)}
          placeholder={t("stockOpnameFillPage.notesPlaceholder")}
          className={inputClass}
        />
      </td>
      <td className={`${cellClass} w-7 text-center`}>
        {error && <span title={error} className="inline-block w-2 h-2 rounded-full bg-red-500 cursor-help" />}
      </td>
    </tr>
  )
}

export const StockOpnameFillGridRow = memo(StockOpnameFillGridRowInner)
