import { useEffect, useRef, useState } from "react"
import { useAssetList } from "../../../hooks/query/asset/list"

interface AssetPickerProps {
  label: string
  /** id aset yang terpilih */
  value?: number | null
  onChange: (assetId: number | undefined) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  /** jumlah huruf minimal sebelum daftar dicari */
  minChars?: number
  /** filter opsional, mengikuti dto.AssetListFilter di backend */
  assetStatus?: string
  branchCode?: string
  labelClassName?: string
  containerClassName?: string
}

/**
 * Pemilih aset satu field, bergaya autocomplete.
 *
 * Daftar aset bisa ratusan sementara endpoint `/assets` dibatasi 100 baris per
 * request (dto.AssetListFilter, `max=100`), jadi pencariannya dijalankan di
 * server dan baru berjalan setelah beberapa huruf diketik — bukan menampilkan
 * seluruh daftar lalu memfilter sisa yang sudah terpotong.
 *
 * Mengetik ulang setelah memilih akan membatalkan pilihan, supaya teks yang
 * terlihat tidak pernah berbeda dengan id yang tersimpan.
 */
export function AssetPicker({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  minChars = 3,
  assetStatus,
  branchCode,
  labelClassName,
  containerClassName,
}: AssetPickerProps) {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // tunda pencarian supaya tidak satu request tiap ketukan
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(timer)
  }, [query])

  // tutup daftar saat klik di luar
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const enabled = !disabled && debounced.length >= minChars

  const { data, isLoading } = useAssetList({
    page: 1,
    limit: 100,
    search: debounced || undefined,
    assetStatus,
    branchCode,
    enabled,
  })

  const assets = data?.data?.data ?? []
  const total = data?.data?.total ?? 0

  const handleType = (text: string) => {
    setQuery(text)
    setOpen(true)
    // teks diubah → pilihan lama tidak berlaku lagi
    if (value) onChange(undefined)
  }

  const handlePick = (asset: { id: number; asset_number: string; asset_name: string }) => {
    onChange(asset.id)
    setQuery(`${asset.asset_number} — ${asset.asset_name}`)
    setOpen(false)
  }

  const hasError = !!error
  const tooShort = debounced.length > 0 && debounced.length < minChars

  return (
    <div className={containerClassName} ref={containerRef}>
      <label
        className={
          labelClassName ||
          "block text-sm font-medium mb-1 md:mb-2 text-gray-700 dark:text-gray-300"
        }
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleType(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          disabled={disabled}
          placeholder={`Ketik minimal ${minChars} huruf nomor atau nama aset...`}
          autoComplete="off"
          className={`w-full px-4 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            hasError
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
          }`}
        />

        {value && !open && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}

        {open && !disabled && (
          <div className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            {tooShort || debounced.length === 0 ? (
              <p className="px-4 py-3 text-xs text-gray-400">
                Ketik minimal {minChars} huruf untuk mencari
              </p>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-5">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : assets.length === 0 ? (
              <p className="px-4 py-3 text-xs text-gray-400">Aset tidak ditemukan</p>
            ) : (
              <>
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => handlePick(asset)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="block text-sm text-gray-800 dark:text-gray-200 truncate">
                      {asset.asset_name}
                    </span>
                    <span className="block text-xs font-mono text-gray-400 truncate">
                      {asset.asset_number}
                      {asset.category_name ? ` · ${asset.category_name}` : ""}
                    </span>
                  </button>
                ))}

                {total > assets.length && (
                  <p className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800">
                    {total} aset cocok, persempit pencarian
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gray-400">{helperText}</p>
      ) : null}
    </div>
  )
}
