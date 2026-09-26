export interface ListTab {
  label: string
  value: string
  count: number
}

interface ListTabsProps {
  tabs: ListTab[]
  activeTab: string
  onChange: (value: string) => void
}

/**
 * Tab penyaring di atas tabel daftar transaksi.
 *
 * Angka dan penyaringannya datang dari server, bukan dihitung dari baris yang
 * sedang tampil — daftarnya paginasi, dan tab "Menunggu Saya" memang tidak bisa
 * ditentukan dari data satu halaman.
 */
export function ListTabs({ tabs, activeTab, onChange }: ListTabsProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 mt-4">
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors rounded-t-md whitespace-nowrap ${
              activeTab === tab.value
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.value
                  ? "bg-white/20 dark:bg-black/20 text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
