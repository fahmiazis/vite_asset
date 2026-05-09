import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

import { Selects } from "../../molecules/input/selects"

import type { Item } from "../../../models/transaction/detailWStages"
import type { VerifyProcurementItem } from "../../../services/transaction/verif"

import { useVerifyProcurement } from "../../../hooks/mutation/transaction/verify"
import { useInitiateApproval } from "../../../hooks/mutation/transaction/initiateApproval"

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = "ASSET" | "NON_ASSET"

type ItemVerifyState = {
  transaction_procurement_id: number
  item_name: string
  item_type: ItemType | ""
  notes: string
}

// ─── Props ────────────────────────────────────────────────────────────────────

type VerifyModalProps = {
  transactionNumber: string
  items: Item[]
  onClose: () => void
  onSuccess?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VerifyModal({
  transactionNumber,
  items,
  onClose,
  onSuccess,
}: VerifyModalProps) {
  const { t, i18n } = useTranslation()

  const [verifyItems, setVerifyItems] = useState<ItemVerifyState[]>(
    items.map((item) => ({
      transaction_procurement_id: item.id,
      item_name: item.item_name,
      item_type: "",
      notes: "",
    }))
  )

  const [globalNotes, setGlobalNotes] = useState("")

  const { mutate: verify, isPending } =
    useVerifyProcurement(transactionNumber)

  const { mutate: initiateApproval, isPending: isInitiating } =
    useInitiateApproval(transactionNumber)

  const loading = isPending || isInitiating

  // ─── Dynamic Options ───────────────────────────────────────────────────────

  const ITEM_TYPE_OPTIONS = useMemo(
    () => [
      {
        id: 1,
        value: "ASSET",
        label: t("verifyModal.asset"),
      },
      {
        id: 2,
        value: "NON_ASSET",
        label: t("verifyModal.nonAsset"),
      },
    ],
    [i18n.language]
  )

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleTypeChange = (id: number, value: string) => {
    setVerifyItems((prev) =>
      prev.map((item) =>
        item.transaction_procurement_id === id
          ? {
            ...item,
            item_type: value as ItemType,
          }
          : item
      )
    )
  }

  const handleNotesChange = (id: number, value: string) => {
    setVerifyItems((prev) =>
      prev.map((item) =>
        item.transaction_procurement_id === id
          ? {
            ...item,
            notes: value,
          }
          : item
      )
    )
  }

  const hasUnselected = verifyItems.some(
    (item) => !item.item_type
  )

  const handleSubmit = () => {
    const payload: VerifyProcurementItem[] = verifyItems.map(
      (item) => ({
        transaction_procurement_id:
          item.transaction_procurement_id,
        item_type: item.item_type as ItemType,
        notes: item.notes,
      })
    )

    verify(
      {
        items: payload,
        notes: globalNotes,
      },
      {
        onSuccess: () => {
          initiateApproval(undefined, {
            onSuccess: () => {
              toast.success(
                t("verifyModal.toast.verifySuccess")
              )

              onSuccess?.()
              onClose()
            },

            onError: () => {
              toast.error(
                t("verifyModal.toast.approvalFailed")
              )
            },
          })
          onClose()
        },

        onError: () => {
          toast.error(
            t("verifyModal.toast.verifyFailed")
          )
        },
      }
    )
  }

  // ─── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">

              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {t("verifyModal.title")}
                </h3>

                <p className="text-xs text-gray-400 mt-0.5">
                  {transactionNumber}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Summary */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/40">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("verifyModal.totalItems", {
                count: verifyItems.length,
              })}
            </p>

            {hasUnselected && (
              <div className="flex items-center gap-1 text-[11px] text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-md">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.591c.75 1.334-.213 2.99-1.742 2.99H3.48c-1.53 0-2.492-1.656-1.743-2.99L8.257 3.1z" />
                </svg>

                {t("verifyModal.validation")}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {verifyItems.map((item, index) => (
            <div
              key={item.transaction_procurement_id}
              className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-950 shadow-sm"
            >
              {/* Item Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {t("verifyModal.item")} #{index + 1}
                  </p>

                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {item.item_name}
                  </h4>
                </div>

                {item.item_type && (
                  <span className="text-[11px] px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20">
                    {item.item_type === "ASSET"
                      ? t("verifyModal.asset")
                      : t("verifyModal.nonAsset")}
                  </span>
                )}
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Item Type */}
                <div>
                  <Selects
                    label={t("verifyModal.itemType")}
                    value={item.item_type}
                    onChange={(v) =>
                      handleTypeChange(
                        item.transaction_procurement_id,
                        v
                      )
                    }
                    options={ITEM_TYPE_OPTIONS}
                    placeholder={t(
                      "verifyModal.selectType"
                    )}
                    required
                    labelClassName="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    selectClassName="text-sm py-2"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("verifyModal.notes")}{" "}
                    <span className="text-gray-400 font-normal">
                      ({t("verifyModal.optional")})
                    </span>
                  </label>

                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) =>
                      handleNotesChange(
                        item.transaction_procurement_id,
                        e.target.value
                      )
                    }
                    placeholder={t(
                      "verifyModal.notesPlaceholder"
                    )}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Global Notes */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-gray-50/70 dark:bg-gray-900/30">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t("verifyModal.globalNotes")}{" "}
              <span className="text-gray-400 font-normal">
                ({t("verifyModal.optional")})
              </span>
            </label>

            <textarea
              rows={3}
              value={globalNotes}
              onChange={(e) =>
                setGlobalNotes(e.target.value)
              }
              placeholder={t(
                "verifyModal.globalNotesPlaceholder"
              )}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {t("verifyModal.cancel")}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || hasUnselected}
            className="flex-1 px-4 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}

            {loading
              ? t("verifyModal.verifying")
              : t("verifyModal.verify")}
          </button>
        </div>
      </div>
    </div>
  )
}