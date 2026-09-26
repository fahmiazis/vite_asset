import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Inputs } from "../../molecules/input/inputs"
import { Selects } from "../../molecules/input/selects"
import { ToggleRow } from "../attachmentSetting/column"
import { useRoleList } from "../../../hooks/query/role/list"
import {
  emailActionsFor,
  emailPlaceholders,
  emailStagesByType,
  emailTransactionTypes,
} from "../../../constans/email"
import type { EmailAction, EmailTransactionType } from "../../../models/emailSetting/template"

export interface EmailTemplateFormValue {
  transaction_type: EmailTransactionType | ""
  stage: string
  action: EmailAction
  subject: string
  body: string
  cc_role_ids: string[]
  is_active: boolean
}

interface EmailTemplateFormProps {
  initial: EmailTemplateFormValue
  /** edit: jenis transaksi, stage, dan aksi adalah kunci template — dikunci */
  mode: "create" | "edit"
  isPending: boolean
  onSubmit: (value: EmailTemplateFormValue) => void
  onCancel: () => void
}

export function EmailTemplateForm({ initial, mode, isPending, onSubmit, onCancel }: EmailTemplateFormProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState<EmailTemplateFormValue>(initial)
  const [error, setError] = useState("")
  // placeholder disisipkan ke field yang terakhir difokus
  const [focused, setFocused] = useState<"subject" | "body">("body")
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const { data: roleData, isLoading: isLoadingRoles } = useRoleList()
  const roles = roleData?.data ?? []

  const locked = mode === "edit"
  // agreement lintas cabang — aturan penerimanya berbeda
  const isAgreement = form.transaction_type === "disposal_agreement"

  const set = <K extends keyof EmailTemplateFormValue>(key: K, value: EmailTemplateFormValue[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError("")
  }

  const stageOptions = form.transaction_type
    ? emailStagesByType[form.transaction_type].map((s) => ({ id: s, value: s, label: s }))
    : []

  const actionOptions = emailActionsFor(form.transaction_type, form.stage).map((a) => ({
    id: a,
    value: a,
    label: t(`emailSetting.action.${a}`),
  }))

  const insertPlaceholder = (name: string) => {
    const token = `{{${name}}}`
    if (focused === "subject") {
      set("subject", form.subject + token)
      return
    }
    // sisipkan di posisi kursor body kalau ada
    const el = bodyRef.current
    if (el && typeof el.selectionStart === "number") {
      const start = el.selectionStart
      const end = el.selectionEnd ?? start
      const next = form.body.slice(0, start) + token + form.body.slice(end)
      set("body", next)
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(start + token.length, start + token.length)
      })
      return
    }
    set("body", form.body + token)
  }

  const toggleRole = (id: string) =>
    set(
      "cc_role_ids",
      form.cc_role_ids.includes(id)
        ? form.cc_role_ids.filter((r) => r !== id)
        : [...form.cc_role_ids, id]
    )

  const handleSubmit = () => {
    if (!form.transaction_type) return setError(t("emailSetting.form.errors.transactionType"))
    if (!form.stage) return setError(t("emailSetting.form.errors.stage"))
    if (!form.subject.trim()) return setError(t("emailSetting.form.errors.subject"))
    if (!form.body.trim()) return setError(t("emailSetting.form.errors.body"))
    if (form.cc_role_ids.length === 0) return setError(t("emailSetting.form.errors.ccRoles"))
    onSubmit({ ...form, subject: form.subject.trim() })
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {locked ? t("emailSetting.form.editTitle") : t("emailSetting.form.createTitle")}
      </h3>

      {/* Kunci template */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Selects
          label={t("emailSetting.form.transactionType")}
          value={form.transaction_type}
          onChange={(v) => {
            // stage lama belum tentu ada di alur baru
            setForm((prev) => ({ ...prev, transaction_type: v as EmailTransactionType, stage: "", action: "proceed" }))
            setError("")
          }}
          options={emailTransactionTypes}
          placeholder={t("emailSetting.form.transactionTypePlaceholder")}
          disabled={locked}
          required
        />
        <Selects
          label={t("emailSetting.form.stage")}
          value={form.stage}
          onChange={(v) => {
            // aksi lama belum tentu tersedia di stage baru (mis. agreement CREATE)
            const actions = emailActionsFor(form.transaction_type, v)
            setForm((prev) => ({
              ...prev,
              stage: v,
              action: actions.includes(prev.action) ? prev.action : actions[0],
            }))
            setError("")
          }}
          options={stageOptions}
          placeholder={t("emailSetting.form.stagePlaceholder")}
          helperText={t("emailSetting.form.stageHelper")}
          disabled={locked || !form.transaction_type}
          required
        />
        <Selects
          label={t("emailSetting.form.action")}
          value={form.action}
          onChange={(v) => set("action", v as EmailAction)}
          options={actionOptions}
          disabled={locked}
          showPlaceholder={false}
          required
        />
      </div>

      {/* Penerima To dihitung otomatis */}
      <div className="flex items-start gap-3 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
          <p className="font-medium">{t("emailSetting.form.toInfoTitle")}</p>
          <p>
            {isAgreement
              ? t(`emailSetting.form.toInfoAgreement.${form.action === "cancel" ? "proceed" : form.action}`)
              : t(`emailSetting.form.toInfo.${form.action}`)}
          </p>
        </div>
      </div>

      {/* Isi */}
      <div onFocus={() => setFocused("subject")}>
        <Inputs
          label={t("emailSetting.form.subject")}
          value={form.subject}
          onChange={(v) => set("subject", v)}
          placeholder={t("emailSetting.form.subjectPlaceholder")}
          helperText={t("emailSetting.form.subjectHelper")}
          maxLength={255}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("emailSetting.form.body")} <span className="text-red-500">*</span>
        </label>
        <textarea
          ref={bodyRef}
          rows={9}
          value={form.body}
          onFocus={() => setFocused("body")}
          onChange={(e) => set("body", e.target.value)}
          placeholder={t("emailSetting.form.bodyPlaceholder")}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
        />
        <p className="text-xs text-gray-400">{t("emailSetting.form.bodyHelper")}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {t("emailSetting.form.placeholders", {
            field: focused === "subject" ? t("emailSetting.form.subject") : t("emailSetting.form.body"),
          })}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {emailPlaceholders.map((name) => (
            <button
              key={name}
              type="button"
              // mousedown supaya fokus field tidak berpindah ke tombol
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertPlaceholder(name)}
              title={t(`emailSetting.placeholder.${name}`)}
              className="px-2 py-1 text-[11px] font-mono rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {`{{${name}}}`}
            </button>
          ))}
        </div>
      </div>

      {/* CC per role */}
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("emailSetting.form.ccRoles")} <span className="text-red-500">*</span>
          </p>
          <p className="text-xs text-gray-400">
            {isAgreement ? t("emailSetting.form.ccRolesHelperAgreement") : t("emailSetting.form.ccRolesHelper")}
          </p>
        </div>
        {isLoadingRoles ? (
          <p className="text-xs text-gray-400">{t("emailSetting.loading")}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {roles.map((role) => {
              const checked = form.cc_role_ids.includes(role.id)
              return (
                <label
                  key={role.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                    checked
                      ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRole(role.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="truncate">{role.name}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <ToggleRow label={t("emailSetting.form.active")} value={form.is_active} onChange={(v) => set("is_active", v)} />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          disabled={isPending}
          className="flex-1 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          {t("emailSetting.cancel")}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {isPending ? t("emailSetting.saving") : locked ? t("emailSetting.save") : t("emailSetting.create")}
        </button>
      </div>
    </div>
  )
}
