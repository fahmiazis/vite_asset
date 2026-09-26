import type { ReactNode } from "react"
import { PlusSignIcon } from "hugeicons-react"
import Links from "../../atoms/links"

interface ListHeaderProps {
  title: string
  /** keterangan di bawah judul, mis. jumlah data */
  subtitle?: string
  /** tujuan tombol tambah — kalau kosong, tombolnya tidak dirender */
  createHref?: string
  createLabel?: string
  /** tombol tambahan di kiri tombol utama */
  actions?: ReactNode
}

/**
 * Header daftar transaksi, mengikuti bentuk header halaman transaction
 * (judul + keterangan di kiri, tombol aksi di kanan) supaya ketiga halaman
 * daftar terlihat satu keluarga.
 *
 * Dibuat generik, bukan menyalin organisms/transaction/head.tsx, karena yang
 * itu terikat ke i18n dan rute transaction.
 */
export default function ListHeader({
  title,
  subtitle,
  createHref,
  createLabel,
  actions,
}: ListHeaderProps) {
  return (
    <div className="flex flex-col gap-3 py-4 px-4 md:px-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-base font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        {createHref && (
          <Links
            href={createHref}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            <PlusSignIcon size={14} />
            <span>{createLabel}</span>
          </Links>
        )}
      </div>
    </div>
  )
}
