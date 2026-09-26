import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Notification01Icon } from "hugeicons-react"
import { useWaitingNotifications } from "../../../../hooks/query/notification/waiting"
import type { waitingNotification } from "../../../../models/notification"

// halaman detail tiap jenis — nomor transaksi dipakai mentah, sama dengan
// tautan di tabel daftar (rute detail memakai splat)
const DETAIL_PATH: Record<waitingNotification["transaction_type"], string> = {
  procurement: "/dashboard/procurement/",
  mutation: "/dashboard/mutation/",
  disposal: "/dashboard/disposal/",
  disposal_agreement: "/dashboard/disposal-agreement/",
  handover: "/dashboard/handover/",
}

const TYPE_STYLE: Record<waitingNotification["transaction_type"], string> = {
  procurement: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  mutation: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  disposal: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  disposal_agreement: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  handover: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
}

// Disposal di APPROVAL_AGREEMENT tidak dikerjakan dari detailnya: tugas pic
// asset adalah mengelompokkannya ke agreement baru. Karena itu diarahkan ke
// halaman buat agreement dengan transaksi ini sudah tercentang.
const isAwaitingAgreement = (item: waitingNotification) =>
  item.transaction_type === "disposal" && item.current_stage === "APPROVAL_AGREEMENT"

function targetPath(item: waitingNotification) {
  if (isAwaitingAgreement(item)) {
    return `/dashboard/disposal-agreement/create?select=${encodeURIComponent(item.transaction_number)}`
  }
  return DETAIL_PATH[item.transaction_type] + item.transaction_number
}

// kode bahasa app → locale Intl
const INTL_LOCALE: Record<string, string> = { id: "id", en: "en", th: "th", vn: "vi", zh: "zh" }

function relativeTime(iso: string, lang: string) {
  const diffSec = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(INTL_LOCALE[lang] ?? "id", { numeric: "auto" })
  const abs = Math.abs(diffSec)
  if (abs < 60) return rtf.format(diffSec, "second")
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute")
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour")
  return rtf.format(Math.round(diffSec / 86400), "day")
}

/**
 * Lonceng "Menunggu Tindakan". Isinya bukan notifikasi tersimpan melainkan
 * daftar "Menunggu Saya" dari backend — membuka detail tidak menghapusnya;
 * pengajuan baru hilang dari sini setelah aksinya benar-benar dikerjakan.
 */
export default function NotificationBell() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isError } = useWaitingNotifications()
  const total = data?.data?.total ?? 0
  const items = data?.data?.items ?? []

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const openItem = (item: waitingNotification) => {
    setOpen(false)
    navigate(targetPath(item))
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("notification.title")}
        className="relative p-2 text-lg rounded-xl border border-zinc-300 dark:border-zinc-700"
      >
        <Notification01Icon />
        {total > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[11px] font-bold leading-none ring-2 ring-blue-50 dark:ring-gray-900">
            {total > 99 ? "99+" : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-24px)] z-50 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("notification.title")}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t("notification.count", { count: total })}</span>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-6 text-center text-sm text-gray-400">{t("notification.loading")}</p>
            ) : isError ? (
              <p className="px-4 py-6 text-center text-sm text-red-500">{t("notification.error")}</p>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("notification.emptyTitle")}</p>
                <p className="text-xs text-gray-400 mt-1">{t("notification.emptyHint")}</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item) => (
                  <li key={`${item.transaction_type}-${item.transaction_number}`}>
                    <button
                      onClick={() => openItem(item)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${TYPE_STYLE[item.transaction_type]}`}>
                          {t(`notification.type.${item.transaction_type}`)}
                        </span>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {relativeTime(item.since, i18n.language)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                        {item.transaction_number}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-mono">{item.current_stage}</span>
                        {item.created_by_name && ` · ${item.created_by_name}`}
                      </p>
                      {isAwaitingAgreement(item) && (
                        <p className="mt-1 text-[11px] font-medium text-purple-600 dark:text-purple-400">
                          → {t("notification.createAgreement")}
                        </p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {total > items.length && (
            <p className="px-4 py-2 text-[11px] text-center text-gray-400 border-t border-gray-100 dark:border-gray-800">
              {t("notification.more", { shown: items.length, total })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
