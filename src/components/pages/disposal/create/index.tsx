import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateDisposal } from "../../../../hooks/mutation/disposal/create"

// ─── Constants ────────────────────────────────────────────────────────────────

const DISPOSAL_TYPE_OPTIONS = [
  { value: "DISPOSE", label: "Dispose", desc: "Penghapusan aset dari pencatatan" },
  { value: "SELL", label: "Sell", desc: "jual jual" },
]

const todayISO = new Date().toISOString().split("T")[0]
const todayLocale = new Date().toLocaleDateString("id-ID", {
  day: "2-digit", month: "long", year: "numeric",
})

// ─── Component ────────────────────────────────────────────────────────────────

export default function DisposalFormPage() {
  const navigate = useNavigate()

  const [disposalType, setDisposalType] = useState("DISPOSE")
  const [notes, setNotes] = useState("")

  const { mutate: submitDisposal, isPending } = useCreateDisposal({
    redirectOnSuccess: true,
    redirectPath: "/dashboard/disposal",
  })

  const handleSubmit = () => {
    submitDisposal({
      transaction_date: todayISO,
      disposal_type: disposalType,
      notes,
    })
  }

  const selectedType = DISPOSAL_TYPE_OPTIONS.find((o) => o.value === disposalType)!

  return (
    <div className="space-y-6 mt-4">

      {/* Breadcrumb + Header */}
      <div>
        <p className="text-xs text-gray-400 mb-1">
          Dashboard &rsaquo; Transaksi &rsaquo;{" "}
          <span className="text-gray-600 dark:text-gray-300">Disposal Aset</span>
        </p>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Form Disposal Aset</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Ajukan permohonan disposal untuk aset yang tidak lagi digunakan
        </p>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5 items-start">

        {/* ── Left: Form ── */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Informasi Transaksi
          </h2>

          {/* Tanggal Transaksi */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Tanggal Transaksi <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-300">{todayLocale}</span>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                Auto
              </span>
            </div>
          </div>

          {/* Tipe Disposal */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Tipe Disposal <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {DISPOSAL_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDisposalType(opt.value)}
                  className={`flex flex-col items-start gap-1 px-3 py-3 rounded-xl border-2 text-left transition-all ${
                    disposalType === opt.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-950"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-sm font-semibold ${
                      disposalType === opt.value
                        ? "text-indigo-700 dark:text-indigo-300"
                        : "text-gray-700 dark:text-gray-200"
                    }`}>
                      {opt.label}
                    </span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      disposalType === opt.value
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {disposalType === opt.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed ${
                    disposalType === opt.value
                      ? "text-indigo-500 dark:text-indigo-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}>
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Catatan{" "}
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masukkan catatan atau alasan disposal aset..."
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none"
            />
          </div>
        </div>

        {/* ── Right: Summary + Actions ── */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Ringkasan
          </h2>

          {/* Summary rows */}
          <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
            <div className="flex justify-between items-center py-2.5 text-xs">
              <span className="text-gray-400">Tanggal</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{todayLocale}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 text-xs">
              <span className="text-gray-400">Tipe disposal</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 font-medium">
                {selectedType.label}
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5 text-xs">
              <span className="text-gray-400">Status</span>
              <span className="px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium">
                Draft
              </span>
            </div>
          </div>

          {/* Notice */}
          <div className="flex gap-2 px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
              Pengajuan akan diverifikasi dan disetujui oleh pejabat berwenang sebelum dieksekusi.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengajukan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Ajukan Disposal
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}