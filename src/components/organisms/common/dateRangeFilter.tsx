import { useTranslation } from "react-i18next"

export interface DateRangeValue {
  start_date: string
  end_date: string
}

interface DateRangeFilterProps extends DateRangeValue {
  onChange: (range: DateRangeValue) => void
}

/**
 * Dua input tanggal transaksi (dari–sampai) untuk baris filter halaman daftar.
 *
 * Sengaja tanpa label dan tanpa tombol reset sendiri: komponennya duduk di
 * dalam baris filter bersama kontrol lain, dan reset di halaman-halaman ini
 * mengembalikan SELURUH filter, bukan hanya tanggal.
 */
export function DateRangeFilter({
  start_date,
  end_date,
  onChange,
}: DateRangeFilterProps) {
  const { t } = useTranslation()

  const inputClass =
    "px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <>
      <input
        type="date"
        value={start_date}
        onChange={(e) => onChange({ start_date: e.target.value, end_date })}
        className={inputClass}
        title={t("dateRange.from")}
      />
      <input
        type="date"
        value={end_date}
        onChange={(e) => onChange({ start_date, end_date: e.target.value })}
        className={inputClass}
        title={t("dateRange.to")}
      />
    </>
  )
}
