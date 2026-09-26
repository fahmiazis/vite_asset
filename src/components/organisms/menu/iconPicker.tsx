import { useState } from "react"
import { Icon } from "@iconify/react"

/** Ikon yang sering dipakai untuk menu, supaya tidak perlu hafal nama Iconify */
const SUGGESTED = [
  "lucide:layout-dashboard",
  "lucide:settings",
  "lucide:database",
  "lucide:users",
  "lucide:building-2",
  "lucide:box",
  "lucide:package",
  "lucide:shopping-cart",
  "lucide:arrow-left-right",
  "lucide:trash-2",
  "lucide:clipboard-list",
  "lucide:trending-down",
  "lucide:file-text",
  "lucide:check-circle",
  "lucide:shield",
  "lucide:qr-code",
]

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/**
 * Input nama ikon Iconify dengan pratinjau langsung dan pilihan cepat.
 * Nama ikon disimpan apa adanya ke kolom icon_name.
 */
export function IconPicker({ value, onChange, disabled = false }: IconPickerProps) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
          {value ? (
            <Icon icon={value} width={20} height={20} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="lucide:settings"
          className="flex-1 min-w-0 px-3 py-2.5 text-sm font-mono border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={() => setShowPicker((v) => !v)}
          disabled={disabled}
          className="px-3 py-2 text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          Pilih
        </button>
      </div>

      {showPicker && (
        <div className="mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950">
          <div className="grid grid-cols-8 gap-1.5">
            {SUGGESTED.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => {
                  onChange(name)
                  setShowPicker(false)
                }}
                className={`flex items-center justify-center h-9 rounded-lg border transition-colors ${
                  value === name
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon icon={name} width={18} height={18} className="text-gray-600 dark:text-gray-300" />
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Ikon lain bisa dicari di{" "}
            <a
              href="https://icon-sets.iconify.design"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2"
            >
              icon-sets.iconify.design
            </a>
            , salin nama ikonnya lalu tempel di kolom di atas.
          </p>
        </div>
      )}
    </div>
  )
}
