import { useState, type ReactNode } from "react"

type Tone = "indigo" | "emerald" | "red"

const TONE: Record<Tone, { bg: string; ring: string; icon: string; btn: string }> = {
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    ring: "border-indigo-100 dark:border-indigo-800",
    icon: "text-indigo-600 dark:text-indigo-400",
    btn: "bg-indigo-600 hover:bg-indigo-700",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    ring: "border-emerald-100 dark:border-emerald-800",
    icon: "text-emerald-600 dark:text-emerald-400",
    btn: "bg-emerald-600 hover:bg-emerald-700",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    ring: "border-red-100 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    btn: "bg-red-600 hover:bg-red-700",
  },
}

interface StageActionModalProps {
  title: string
  transactionNumber: string
  infoMessage: ReactNode
  /** label field catatan; kalau tidak diisi, field catatan disembunyikan */
  notesLabel?: string
  notesPlaceholder?: string
  notesRequired?: boolean
  /** panjang minimal catatan kalau wajib (backend reject: min 10) */
  notesMinLength?: number
  confirmLabel: string
  pendingLabel?: string
  tone?: Tone
  isPending?: boolean
  /** children ditampilkan di atas field catatan, mis. form nilai jual */
  children?: ReactNode
  /** blokir tombol konfirmasi dari luar (mis. dokumen belum lengkap) */
  confirmDisabled?: boolean
  onConfirm: (notes: string) => void
  onClose: () => void
}

export function StageActionModal({
  title,
  transactionNumber,
  infoMessage,
  notesLabel,
  notesPlaceholder,
  notesRequired = false,
  notesMinLength = 0,
  confirmLabel,
  pendingLabel = "Memproses...",
  tone = "indigo",
  isPending = false,
  children,
  confirmDisabled = false,
  onConfirm,
  onClose,
}: StageActionModalProps) {
  const [notes, setNotes] = useState("")
  const t = TONE[tone]

  const notesTooShort =
    notesRequired && notes.trim().length < Math.max(notesMinLength, 1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-400 mt-1 truncate font-mono">{transactionNumber}</p>
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
        <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div className={`flex items-start gap-3 p-3 rounded-xl border ${t.bg} ${t.ring}`}>
            <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${t.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className={`text-xs font-medium ${t.icon}`}>{infoMessage}</div>
          </div>

          {children}

          {notesLabel && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                {notesLabel}{" "}
                {notesRequired ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-gray-400 font-normal">(opsional)</span>
                )}
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={notesPlaceholder}
                disabled={isPending}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none transition-all disabled:opacity-50"
              />
              {notesRequired && notesMinLength > 0 && (
                <p className={`text-xs ${notesTooShort ? "text-red-500" : "text-gray-400"}`}>
                  Minimal {notesMinLength} karakter ({notes.trim().length}/{notesMinLength})
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(notes)}
            disabled={isPending || notesTooShort || confirmDisabled}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${t.btn}`}
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
