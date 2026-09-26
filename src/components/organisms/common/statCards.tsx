import type { ReactNode } from "react"

export interface StatCardItem {
  color: "green" | "yellow" | "red" | "gray"
  icon: ReactNode
  value: number | string
  label: string
  /** keterangan kecil di bawah angka, mis. porsi terhadap total */
  hint?: string
}

const colorMap = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
  gray: "bg-gray-800 dark:bg-gray-200",
}

const iconBgMap = {
  green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  red: "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400",
  gray: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
}

/**
 * Kartu ringkasan untuk halaman daftar transaksi.
 *
 * Sengaja hanya menerima angka dari pemanggil — tidak ada nilai contoh di
 * dalam komponen — supaya tidak ada angka karangan yang tampil seolah-olah
 * data sungguhan.
 */
export function StatCards({
  items,
  isLoading = false,
  className = "",
}: {
  items: StatCardItem[]
  isLoading?: boolean
  className?: string
}) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6 pb-4 ${className}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="relative flex flex-col gap-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 md:p-5 shadow-sm overflow-hidden flex-1 min-w-0"
        >
          <div className={`absolute top-0 left-0 right-0 h-1 ${colorMap[item.color]}`} />

          <div
            className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              iconBgMap[item.color]
            }`}
          >
            {item.icon}
          </div>

          <div>
            {isLoading ? (
              <div className="h-7 w-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            ) : (
              <p className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {item.value}
              </p>
            )}
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
              {item.label}
            </p>
          </div>

          {item.hint && !isLoading && (
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {item.hint}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
