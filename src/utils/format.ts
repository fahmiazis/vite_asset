export function formatRupiah(value: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value)}`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value)
}

export function formatCompactRupiah(value: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
  return `Rp ${formatted}`
}
