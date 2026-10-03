import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Download04Icon, Upload04Icon } from "hugeicons-react"
import type { ImportEntity, ImportMode, ImportResult, ImportRowError } from "../../../models/masterImport"
import { useImportTemplate, useMasterExport, useMasterImport } from "../../../hooks/mutation/common/masterImport"
import { useSingleSubmit } from "../../../hooks/useSingleSubmit"

interface MasterImportButtonProps {
  entity: ImportEntity
  /** prefix query key daftar yang di-refresh setelah tersimpan, mis. ["branch-list"] */
  invalidateKeys: string[]
  className?: string
}

/** kolom kunci per entitas — nama kolom Excel, sama di semua bahasa */
const resultColumn: Record<ImportEntity, string> = {
  branch: "branch_code",
  user: "username",
  asset: "asset_number",
}

/** mode upload yang tersedia per entitas; member hanya untuk branch */
const entityModes: Record<ImportEntity, ImportMode[]> = {
  branch: ["new", "update", "member"],
  user: ["new", "update"],
  asset: ["new", "update"],
}

function modeLabelKey(mode: ImportMode): string {
  return { new: "masterImport.modeNew", update: "masterImport.modeUpdate", member: "masterImport.modeMember" }[mode]
}

function modeDescKey(mode: ImportMode, entity: ImportEntity): string {
  if (mode === "member") return "masterImport.modeMemberDesc"
  return `masterImport.${mode === "new" ? "modeNewDesc" : "modeUpdateDesc"}.${entity}`
}

interface MasterExportButtonProps {
  entity: ImportEntity
  /** filter yang ikut dikirim (aset: sama dengan filter halaman) */
  params?: Record<string, string | number | undefined>
  className?: string
}

/**
 * Unduh data yang sudah ada dalam format template mass update — bisa diedit
 * lalu diunggah ulang lewat Upload → Mass update.
 */
export function MasterExportButton({ entity, params, className }: MasterExportButtonProps) {
  const { t } = useTranslation()
  const exporter = useMasterExport(entity)

  return (
    <button
      onClick={() => exporter.mutate(params)}
      disabled={exporter.isPending}
      className={
        className ??
        "flex items-center gap-1.5 px-4 py-2 text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-50"
      }
    >
      <Download04Icon size={14} />
      {exporter.isPending ? t("masterImport.downloading") : t("masterImport.download")}
    </button>
  )
}

/**
 * Tombol + dialog upload Excel master data (branch, user, asset).
 *
 * Alurnya dua langkah: Validasi (dry run, tidak menyimpan apa pun) lalu
 * Simpan. Backend memproses satu file utuh — selama masih ada baris error,
 * tidak ada yang tersimpan, jadi tombol Simpan baru aktif kalau semua valid.
 */
export function MasterImportButton({ entity, invalidateKeys, className }: MasterImportButtonProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<ImportMode>("new")
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [onlyErrors, setOnlyErrors] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const template = useImportTemplate(entity)
  const upload = useMasterImport({ entity, invalidateKeys })
  const guard = useSingleSubmit(upload.isPending)

  const reset = () => {
    setFile(null)
    setResult(null)
    setOnlyErrors(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  const close = () => {
    if (upload.isPending) return
    setOpen(false)
    reset()
  }

  const submit = (dryRun: boolean) =>
    guard(() => {
      if (!file) return
      return upload.mutateAsync({ mode, file, dryRun }).then((res) => {
        setResult(res)
        setOnlyErrors(res.error_rows > 0)
      })
    })

  const saved = !!result && !result.dry_run && result.imported > 0
  const canSave = !!result && result.dry_run && result.error_rows === 0 && result.valid_rows > 0

  const errorText = (e: ImportRowError) =>
    t(`masterImport.errors.${e.code}`, { field: e.field, ...e.params, defaultValue: e.message })

  const rows = (result?.rows ?? []).filter((r) => !onlyErrors || r.errors.length > 0)
  // mode member: kolom hasil berisi aksi (set homebase / tambah akses), bukan kode
  const isMember = mode === "member"
  const valueColumns = (result?.columns ?? []).filter((c) => isMember || c !== resultColumn[entity])
  const modes = entityModes[entity]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ??
          "flex items-center gap-1.5 px-4 py-2 text-xs font-medium border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
        }
      >
        <Upload04Icon size={14} />
        {t("masterImport.button")}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col gap-4 overflow-hidden">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t(`masterImport.title.${entity}`)}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("masterImport.description")}</p>
            </div>

            {!saved && (
              <>
                {/* mode */}
                <div className={`grid grid-cols-1 gap-2 ${modes.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                  {modes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      disabled={upload.isPending}
                      onClick={() => {
                        setMode(m)
                        setResult(null)
                      }}
                      className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                        mode === m
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t(modeLabelKey(m))}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {t(modeDescKey(m, entity))}
                      </p>
                    </button>
                  ))}
                </div>

                {/* template + file */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t("masterImport.step1")}</span>
                    <button
                      type="button"
                      onClick={() => template.mutate(mode)}
                      disabled={template.isPending}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      <Download04Icon size={15} />
                      {t("masterImport.downloadTemplate")}
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t("masterImport.templateHint")}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t("masterImport.step2")}</span>
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".xlsx"
                      disabled={upload.isPending}
                      onChange={(e) => {
                        setFile(e.target.files?.[0] ?? null)
                        setResult(null)
                      }}
                      className="text-sm file:mr-3 file:px-3 file:py-2 file:rounded-xl file:border-0 file:bg-gray-100 dark:file:bg-gray-800 file:text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* hasil */}
            {result && (
              <div className="flex flex-col gap-3 min-h-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    {t("masterImport.summaryTotal")}: <b>{result.total_rows}</b>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    {t("masterImport.summaryValid")}: <b>{result.valid_rows}</b>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                    {t("masterImport.summaryError")}: <b>{result.error_rows}</b>
                  </span>
                  {result.error_rows > 0 && (
                    <label className="flex items-center gap-1.5 ml-auto cursor-pointer">
                      <input type="checkbox" checked={onlyErrors} onChange={(e) => setOnlyErrors(e.target.checked)} />
                      {t("masterImport.onlyErrors")}
                    </label>
                  )}
                </div>

                <p
                  className={`text-sm ${
                    result.error_rows > 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"
                  }`}
                >
                  {saved
                    ? t("masterImport.savedTitle", { count: result.imported })
                    : result.error_rows > 0
                      ? t("masterImport.hasErrors")
                      : t("masterImport.allValid")}
                </p>

                <div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-xl max-h-[40vh]">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">{t("masterImport.colRow")}</th>
                        <th className="px-3 py-2 text-left font-medium whitespace-nowrap">
                          {isMember ? t("masterImport.colResult") : resultColumn[entity]}
                          {result.dry_run && mode === "new" && entity !== "user" && (
                            <span className="font-normal text-gray-400"> ({t("masterImport.resultEstimated")})</span>
                          )}
                        </th>
                        <th className="px-3 py-2 text-left font-medium min-w-[220px]">{t("masterImport.colErrors")}</th>
                        {valueColumns.map((col) => (
                          <th key={col} className="px-3 py-2 text-left font-medium whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {rows.map((r) => (
                        <tr key={r.row} className={r.errors.length ? "bg-red-50/60 dark:bg-red-950/20" : ""}>
                          <td className="px-3 py-2 text-gray-500">{r.row}</td>
                          <td className="px-3 py-2 font-medium whitespace-nowrap">
                            {isMember
                              ? r.result
                                ? t(`masterImport.memberResult.${r.result}`)
                                : "-"
                              : r.result || (entity === "asset" && mode === "new" ? t("masterImport.autoNumber") : "-")}
                          </td>
                          <td className="px-3 py-2">
                            {r.errors.length === 0 ? (
                              <span className="text-green-700 dark:text-green-400">{t("masterImport.valid")}</span>
                            ) : (
                              <ul className="list-disc pl-4 text-red-600 dark:text-red-400 space-y-0.5">
                                {r.errors.map((e, i) => (
                                  <li key={i}>{errorText(e)}</li>
                                ))}
                              </ul>
                            )}
                          </td>
                          {valueColumns.map((col) => (
                            <td key={col} className="px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                              {r.values[col] || ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              {saved ? (
                <button
                  onClick={close}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  {t("masterImport.close")}
                </button>
              ) : (
                <>
                  <button
                    onClick={close}
                    disabled={upload.isPending}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    {t("masterImport.cancel")}
                  </button>
                  <button
                    onClick={submit(true)}
                    disabled={!file || upload.isPending}
                    className="px-4 py-2 text-sm font-medium border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {upload.isPending && upload.variables?.dryRun ? t("masterImport.validating") : t("masterImport.validate")}
                  </button>
                  <button
                    onClick={submit(false)}
                    disabled={!canSave || upload.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {upload.isPending && !upload.variables?.dryRun
                      ? t("masterImport.saving")
                      : t("masterImport.save", { count: result?.valid_rows ?? 0 })}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
