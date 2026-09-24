import { InputToggle } from "../../../molecules/input/inputTogle"

export function ToggleRow({
  label,
  hint,
  value,
  onChange,
  disabled,
}: {
  label: string
  hint?: string
  value: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
      <InputToggle checked={value} onChange={onChange} disabled={disabled} />
    </div>
  )
}

export interface ToggleChecklistOption {
  id: number
  label: string
  code: string
}

// ToggleChecklist: pilih banyak item pakai InputToggle per baris (dipakai
// buat relasi status fisik <-> kondisi di master data status).
export function ToggleChecklist({
  title,
  hint,
  options,
  selected,
  onChange,
  disabled,
  emptyText,
}: {
  title: string
  hint?: string
  options: ToggleChecklistOption[]
  selected: Set<number>
  onChange: (next: Set<number>) => void
  disabled?: boolean
  emptyText: string
}) {
  const toggle = (id: number, checked: boolean) => {
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}{" "}
          <span className="text-xs font-normal text-gray-400">
            ({selected.size}/{options.length})
          </span>
        </p>
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 max-h-56 overflow-y-auto">
        {options.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-gray-400">{emptyText}</p>
        ) : (
          options.map((opt) => (
            <div key={opt.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{opt.label}</p>
                <p className="text-[10px] font-mono text-gray-400">{opt.code}</p>
              </div>
              <InputToggle
                checked={selected.has(opt.id)}
                onChange={(checked) => toggle(opt.id, checked)}
                disabled={disabled}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
