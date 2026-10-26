import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { isAxiosError } from "axios"
import Head from "../../molecules/head"
import { useAppReleaseList } from "../../../hooks/query/appRelease/list"
import { useCreateAppRelease, useDeleteAppRelease } from "../../../hooks/mutation/appRelease/release"
import { appReleaseDownloadUrl } from "../../../services/appRelease/release"
import type { appReleaseState } from "../../../models/appRelease/release"
import { ClientPagination, useClientPagination } from "../../molecules/table/pageSize"

const errorMessage = (error: unknown, fallback: string) =>
  (isAxiosError(error) && (error.response?.data as { message?: string } | undefined)?.message) || fallback

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

const inputClass =
  "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"

function UploadModal({ latestBuild, onClose }: { latestBuild: number; onClose: () => void }) {
  const { t } = useTranslation()
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [versionName, setVersionName] = useState("")
  const [buildNumber, setBuildNumber] = useState(String(latestBuild + 1))
  const [notes, setNotes] = useState("")
  const { mutate, isPending } = useCreateAppRelease(setProgress)

  const build = Number(buildNumber)
  const buildInvalid = !Number.isInteger(build) || build <= latestBuild

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!file || !versionName.trim() || buildInvalid) return
    setProgress(0)
    mutate(
      { file, version_name: versionName.trim(), build_number: build, release_notes: notes },
      {
        onSuccess: () => {
          toast.success(t("appRelease.toast.uploaded"))
          onClose()
        },
        onError: (err) => toast.error(errorMessage(err, t("appRelease.toast.uploadFailed"))),
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-lg space-y-4"
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t("appRelease.upload.title")}</h3>

        <label className="block space-y-1">
          <span className="text-sm font-medium">{t("appRelease.upload.file")}</span>
          <input
            type="file"
            accept=".apk,application/vnd.android.package-archive"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-gray-100 dark:file:bg-gray-800"
          />
          {file && <span className="text-xs text-gray-500">{formatSize(file.size)}</span>}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-sm font-medium">{t("appRelease.upload.versionName")}</span>
            <input
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="0.2.0"
              className={inputClass}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">{t("appRelease.upload.buildNumber")}</span>
            <input
              type="number"
              min={latestBuild + 1}
              value={buildNumber}
              onChange={(e) => setBuildNumber(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
        <p className={`text-xs ${buildInvalid ? "text-red-600" : "text-gray-500"}`}>
          {t("appRelease.upload.buildHint", { latest: latestBuild })}
        </p>

        <label className="block space-y-1">
          <span className="text-sm font-medium">{t("appRelease.upload.notes")}</span>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("appRelease.upload.notesPlaceholder")}
            className={inputClass}
          />
        </label>

        {isPending && (
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-500">{t("appRelease.upload.progress", { percent: progress })}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {t("appRelease.cancel")}
          </button>
          <button
            type="submit"
            disabled={isPending || !file || !versionName.trim() || buildInvalid}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
          >
            {isPending ? t("appRelease.uploading") : t("appRelease.upload.submit")}
          </button>
        </div>
      </form>
    </div>
  )
}

function DeleteModal({ row, onClose }: { row: appReleaseState; onClose: () => void }) {
  const { t } = useTranslation()
  const { mutate, isPending } = useDeleteAppRelease()

  const handleDelete = () =>
    mutate(row.id, {
      onSuccess: () => {
        toast.success(t("appRelease.toast.deleted"))
        onClose()
      },
      onError: (err) => toast.error(errorMessage(err, t("appRelease.toast.deleteFailed"))),
    })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          {t("appRelease.delete.title")}
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6 break-words">
          {t("appRelease.delete.message", { label: `${row.version_name} (${row.build_number})` })}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {t("appRelease.cancel")}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
          >
            {isPending ? t("appRelease.deleting") : t("appRelease.delete.confirm")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AppReleasePage() {
  const { t } = useTranslation()
  const { data, isLoading } = useAppReleaseList()
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<appReleaseState | null>(null)

  const rows = data?.data ?? []
  // list sudah urut build_number terbesar dulu
  const latestBuild = rows[0]?.build_number ?? 0
  const pagination = useClientPagination(rows)

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <Head label={t("appRelease.title")} />
        <button
          onClick={() => setUploading(true)}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {t("appRelease.create")}
        </button>
      </section>
      <p className="text-sm text-gray-500 dark:text-gray-400">{t("appRelease.description")}</p>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr className="text-left text-xs font-medium uppercase tracking-wider">
              <th className="px-4 py-3">{t("appRelease.column.version")}</th>
              <th className="px-4 py-3">{t("appRelease.column.buildNumber")}</th>
              <th className="px-4 py-3">{t("appRelease.column.notes")}</th>
              <th className="px-4 py-3">{t("appRelease.column.size")}</th>
              <th className="px-4 py-3">{t("appRelease.column.uploadedBy")}</th>
              <th className="px-4 py-3">{t("appRelease.column.uploadedAt")}</th>
              <th className="px-4 py-3">{t("appRelease.column.actions")}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">{t("appRelease.loading")}</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">{t("appRelease.empty")}</td>
              </tr>
            ) : (
              pagination.pageRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 align-top">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {row.version_name}
                      {row.build_number === latestBuild && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {t("appRelease.latest")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{row.build_number}</td>
                  <td className="px-4 py-3 max-w-[320px] whitespace-pre-line text-gray-600 dark:text-gray-300">
                    {row.release_notes || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatSize(row.file_size)}</td>
                  <td className="px-4 py-3">{row.created_by_name || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(row.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={appReleaseDownloadUrl(row.download_path)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                      >
                        {t("appRelease.download")}
                      </a>
                      <button
                        onClick={() => setDeleting(row)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        {t("appRelease.delete.button")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && <ClientPagination pagination={pagination} />}

      {uploading && <UploadModal latestBuild={latestBuild} onClose={() => setUploading(false)} />}
      {deleting && <DeleteModal row={deleting} onClose={() => setDeleting(null)} />}
    </div>
  )
}
