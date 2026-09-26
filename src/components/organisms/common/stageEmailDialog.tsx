import { useEffect, useState, type KeyboardEvent } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import { useStageEmailStore, type StageEmailRequest } from "../../../stores/stageEmailStore"
import {
  resendTransactionEmail,
  sendTransactionEmail,
  type SendTransactionEmailPayload,
} from "../../../services/emailSetting/transactionEmail"
import type { emailRecipient } from "../../../models/emailSetting/transactionEmail"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function apiMessage(error: unknown): string {
  const e = error as { response?: { data?: { message?: string } }; message?: string }
  return e?.response?.data?.message || e?.message || ""
}

// ─── Input chip email ────────────────────────────────────────────────────────

function EmailChipsInput({
  label,
  recipients,
  onChange,
  disabled,
}: {
  label: string
  recipients: emailRecipient[]
  onChange: (next: emailRecipient[]) => void
  disabled?: boolean
}) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState("")
  const [error, setError] = useState("")

  const add = () => {
    const email = draft.trim().replace(/[,;]$/, "").toLowerCase()
    if (!email) return
    if (!EMAIL_PATTERN.test(email)) {
      setError(t("stageEmail.invalidEmail"))
      return
    }
    if (!recipients.some((r) => r.email.toLowerCase() === email)) {
      onChange([...recipients, { name: email, email }])
    }
    setDraft("")
    setError("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === ";") {
      e.preventDefault()
      add()
    } else if (e.key === "Backspace" && !draft && recipients.length > 0) {
      onChange(recipients.slice(0, -1))
    }
  }

  const empty = recipients.length === 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
          {label} <span className="text-red-500">*</span>
        </label>
        {empty && (
          <span className="text-[11px] text-red-500">{t("stageEmail.minOne")}</span>
        )}
      </div>
      <div
        className={`flex flex-wrap items-center gap-1.5 min-h-[42px] px-2 py-1.5 rounded-xl border bg-white dark:bg-gray-900 ${
          empty ? "border-red-300 dark:border-red-800" : "border-gray-300 dark:border-gray-700"
        }`}
      >
        {recipients.map((r) => (
          <span
            key={r.email}
            title={r.email}
            className="inline-flex items-center gap-1 max-w-full pl-2.5 pr-1 py-0.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
          >
            <span className="truncate">
              {r.name && r.name !== r.email ? `${r.name} <${r.email}>` : r.email}
            </span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange(recipients.filter((x) => x.email !== r.email))}
              className="p-0.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800 disabled:opacity-50"
              aria-label={t("stageEmail.remove")}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="email"
          value={draft}
          disabled={disabled}
          onChange={(e) => {
            setDraft(e.target.value)
            setError("")
          }}
          onKeyDown={handleKeyDown}
          onBlur={add}
          placeholder={t("stageEmail.addPlaceholder")}
          className="flex-1 min-w-[160px] px-1 py-1 text-sm bg-transparent text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none disabled:opacity-50"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Dialog ──────────────────────────────────────────────────────────────────

type Phase = "compose" | "running" | "sending" | "failed"

function StageEmailDialog({ request, onClosed }: { request: StageEmailRequest; onClosed: () => void }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { preview, context } = request

  const [to, setTo] = useState<emailRecipient[]>(preview.to)
  const [cc, setCc] = useState<emailRecipient[]>(preview.cc)
  const [additional, setAdditional] = useState("")
  const [phase, setPhase] = useState<Phase>("compose")
  const [failure, setFailure] = useState<{ message: string; logId?: number } | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const canSubmit = phase === "compose" && to.length > 0 && cc.length > 0

  // nomor transaksi final — untuk agreement baru baru diketahui setelah run
  const [transactionNumber, setTransactionNumber] = useState(context.transactionNumber)

  const payload = (number = transactionNumber): SendTransactionEmailPayload => ({
    transaction_type: context.transactionType,
    transaction_number: number,
    template_id: preview.template_id!,
    to: to.map((r) => r.email),
    cc: cc.map((r) => r.email),
    additional_message: additional.trim(),
  })

  const handleSent = () => {
    toast.success(t("stageEmail.sent"))
    queryClient.invalidateQueries({ queryKey: ["email-log-list"] })
    onClosed()
  }

  const deliver = async (retryLogId?: number, number?: string) => {
    setPhase("sending")
    try {
      const log = retryLogId
        ? await resendTransactionEmail(retryLogId)
        : await sendTransactionEmail(payload(number))
      if (log.status === "SENT") {
        handleSent()
        return
      }
      setFailure({ message: log.error_message ?? "", logId: log.id })
    } catch (error) {
      // request-nya sendiri ditolak (bukan SMTP) — belum ada log, jadi
      // kirim ulang berarti mengirim payload yang sama sekali lagi
      setFailure({ message: apiMessage(error), logId: retryLogId })
    }
    queryClient.invalidateQueries({ queryKey: ["email-log-list"] })
    setPhase("failed")
  }

  const handleConfirm = async () => {
    if (!canSubmit) return
    setPhase("running")
    let number = transactionNumber
    try {
      const result = await request.run()
      number = context.resolveNumber?.(result) || number
      setTransactionNumber(number)
    } catch {
      // Aksinya gagal — toast error sudah dimunculkan hook mutasinya. Email
      // tidak dikirim karena tidak ada yang terjadi.
      request.settle(false)
      onClosed()
      return
    }
    request.settle(true)
    await deliver(undefined, number)
  }

  const handleCancel = () => {
    if (phase === "compose") request.settle(false)
    if (phase === "failed") toast(t("stageEmail.resendLater"), { icon: "✉️" })
    onClosed()
  }

  // Esc = batal, hanya selama belum ada yang dijalankan
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && (phase === "compose" || phase === "failed")) handleCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  const busy = phase === "running" || phase === "sending"
  const editable = phase === "compose"

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("stageEmail.title")}
            </h3>
            <p className="text-xs text-gray-400 mt-1 truncate font-mono">{transactionNumber || preview.transaction_number}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">
                {t(`emailSetting.action.${preview.action}`)}
              </span>
              <span className="font-mono text-gray-500 dark:text-gray-400">
                {preview.stage}
                {preview.next_stage && preview.next_stage !== preview.stage && ` → ${preview.next_stage}`}
              </span>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={busy}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto">
          {phase === "failed" ? (
            <div className="p-3 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 space-y-1.5">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{t("stageEmail.failedTitle")}</p>
              {failure?.message && (
                <p className="text-xs text-red-600 dark:text-red-400 break-words">{failure.message}</p>
              )}
              <p className="text-xs text-red-600/80 dark:text-red-400/80">{t("stageEmail.failedHint")}</p>
            </div>
          ) : (
            !preview.mailer_configured && (
              <div className="p-3 rounded-xl border border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-700 dark:text-amber-400">
                {t("stageEmail.mailerNotConfigured")}
              </div>
            )
          )}

          {/* Subject — dikunci */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("stageEmail.subject")}
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-normal text-gray-400">{t("stageEmail.subjectLocked")}</span>
            </label>
            <input
              value={preview.subject}
              readOnly
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-gray-600 dark:text-gray-300 cursor-not-allowed"
            />
          </div>

          <EmailChipsInput label={t("stageEmail.to")} recipients={to} onChange={setTo} disabled={!editable} />
          <EmailChipsInput label={t("stageEmail.cc")} recipients={cc} onChange={setCc} disabled={!editable} />

          {editable && (preview.to.length === 0 || preview.cc.length === 0) && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("stageEmail.noAutoRecipients")}</p>
          )}

          {/* Pesan template — hanya dibaca, tambahan di bawahnya. Info ajuan &
              daftar aset disusun backend, bisa dilihat di pratinjau. */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                {t("stageEmail.body")}
              </label>
              {preview.html && (
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {showPreview ? t("stageEmail.hidePreview") : t("stageEmail.showPreview")}
                </button>
              )}
            </div>
            {showPreview ? (
              // sandbox tanpa izin apa pun — HTML-nya dari server, tapi tetap
              // tidak perlu menjalankan skrip atau membuka tautan di dalam dialog
              <iframe
                title={t("stageEmail.showPreview")}
                srcDoc={preview.html}
                sandbox=""
                className="w-full h-[420px] rounded-xl border border-gray-200 dark:border-gray-800 bg-white"
              />
            ) : (
              <div className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                {preview.body}
              </div>
            )}
            <p className="text-[11px] text-gray-400">{t("stageEmail.autoContent")}</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t("stageEmail.additional")}{" "}
              <span className="text-gray-400 font-normal">({t("stageEmail.optional")})</span>
            </label>
            <textarea
              rows={3}
              value={additional}
              disabled={!editable}
              onChange={(e) => setAdditional(e.target.value)}
              placeholder={t("stageEmail.additionalPlaceholder")}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <button
            onClick={handleCancel}
            disabled={busy}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {phase === "failed" ? t("stageEmail.close") : t("stageEmail.cancel")}
          </button>
          {phase === "failed" ? (
            <button
              onClick={() => deliver(failure?.logId)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
              {t("stageEmail.resend")}
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!canSubmit}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {phase === "running"
                ? t("stageEmail.running")
                : phase === "sending"
                  ? t("stageEmail.sending")
                  : t("stageEmail.confirm")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/** Dipasang sekali di MainLayout. */
export function StageEmailHost() {
  const { t } = useTranslation()
  const request = useStageEmailStore((s) => s.request)
  const preparing = useStageEmailStore((s) => s.preparing)
  const close = useStageEmailStore((s) => s.close)

  return (
    <>
      {preparing && !request && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 shadow-lg text-sm text-gray-600 dark:text-gray-300">
            <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            {t("stageEmail.preparing")}
          </div>
        </div>
      )}
      {request && (
        // key memastikan state dialog baru untuk setiap permintaan
        <StageEmailDialog
          key={`${request.context.transactionNumber}-${request.context.action}-${request.preview.template_id}`}
          request={request}
          onClosed={close}
        />
      )}
    </>
  )
}
