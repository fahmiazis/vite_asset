// Jenis transaksi yang tampil di dashboard: warna dan rute detailnya.
// Rute detail memakai nomor transaksi mentah (splat), sama dengan tautan di
// tabel daftar dan lonceng notifikasi.

export interface TransactionTypeMeta {
  /** nama enum backend, English di semua locale */
  label: string
  color: string
  detailPath: string
}

export const TRANSACTION_TYPES: Record<string, TransactionTypeMeta> = {
  procurement: { label: "Procurement", color: "#6366f1", detailPath: "/dashboard/procurement/" },
  mutation: { label: "Mutation", color: "#8b5cf6", detailPath: "/dashboard/mutation/" },
  disposal: { label: "Disposal", color: "#ef4444", detailPath: "/dashboard/disposal/" },
  handover: { label: "Asset Handover", color: "#14b8a6", detailPath: "/dashboard/handover/" },
  stock_opname: { label: "Stock Opname", color: "#10b981", detailPath: "/dashboard/stock-opname/" },
}

export function transactionTypeMeta(type: string): TransactionTypeMeta {
  return TRANSACTION_TYPES[type] ?? { label: type, color: "#9ca3af", detailPath: "" }
}

export function transactionDetailPath(type: string, number: string): string | undefined {
  const meta = TRANSACTION_TYPES[type]
  return meta ? `${meta.detailPath}${number}` : undefined
}
