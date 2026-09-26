import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSingleSubmit } from "../../../hooks/useSingleSubmit"

/** baris yang bisa ditandai perlu revisi — item procurement / aset mutasi */
export interface RevisableRow {
  id: number
  label: string
  sublabel?: string
}

interface RevisionDecisionModalProps {
  mode: "revise" | "cancel"
  transactionNumber: string
  /** hanya dipakai mode revisi */
  rows?: RevisableRow[]
  isPending?: boolean
  onConfirm: (payload: { notes: string; rowIds: number[] }) => void
  onClose: () => void
}

const MIN_NOTES = 10

/**
 * Dialog untuk dua aksi yang sering tertukar:
 *
 * - **Revisi** diminta APPROVER step berjalan. Transaksi kembali ke DRAFT
 *   dengan isinya utuh, dan approver wajib menandai baris mana yang salah —
 *   tanpa itu pengaju cuma tahu "ada yang salah" tanpa tahu di mana.
 * - **Batal** dilakukan PENGAJU atas pengajuannya sendiri, dan bersifat akhir.
 */
export function RevisionDecisionModal({
  mode,
  transactionNumber,
  rows = [],
  isPending = false,
  onConfirm,
  onClose,
}: RevisionDecisionModalProps) {
  const { t } = useTranslation()
  const [notes, setNotes] = useState("")
  const [selected, setSelected] = useState<number[]>([])
  const guard = useSingleSubmit(isPending)

  const isRevise = mode === "revise"
  const notesTooShort = notes.trim().length < MIN_NOTES
  const noRowSelected = isRevise && selected.length === 0

  const toggle = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )

  const accent = isRevise
    ? "bg-amber-600 hover:bg-amber-700"
    : "bg-red-600 hover:bg-red-700"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t(`revisionDecision.${mode}.title`)}
            </h3>
            <p className="text-xs text-gray-400 mt-1 truncate font-mono">
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

        <div className="px-5 py-4 space-y-3 overflow-y-auto">
          <div
            className={`p-3 rounded-xl border text-xs font-medium ${
              isRevise
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400"
            }`}
          >
            {t(`revisionDecision.${mode}.info`)}
          </div>

          {isRevise && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                {t("revisionDecision.revise.pickRows")}{" "}
                <span className="text-red-500">*</span>
              </label>

              {rows.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center">
                  {t("revisionDecision.revise.noRows")}
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {rows.map((row) => (
                    <label
                      key={row.id}
                      className="flex items-start gap-2.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggle(row.id)}
                        disabled={isPending}
                        className="mt-0.5 accent-amber-600"
                      />
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                          {row.label}
                        </span>
                        {row.sublabel && (
                          <span className="block text-xs text-gray-400 truncate">
                            {row.sublabel}
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t(`revisionDecision.${mode}.notesLabel`)}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isPending}
              placeholder={t(`revisionDecision.${mode}.notesPlaceholder`)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none disabled:opacity-50"
            />
            <p className={`text-xs ${notesTooShort ? "text-red-500" : "text-gray-400"}`}>
              {t("revisionDecision.minChars", {
                min: MIN_NOTES,
                current: notes.trim().length,
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t("revisionDecision.cancelButton")}
          </button>
          <button
            onClick={guard(() =>
              onConfirm({ notes: notes.trim(), rowIds: selected })
            )}
            disabled={isPending || notesTooShort || noRowSelected}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${accent}`}
          >
            {isPending
              ? t("revisionDecision.processing")
              : t(`revisionDecision.${mode}.confirm`)}
          </button>
        </div>
      </div>
    </div>
  )
}
