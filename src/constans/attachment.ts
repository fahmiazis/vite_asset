/**
 * Pilihan untuk konfigurasi dokumen (attachment_configs).
 *
 * Nilainya dicocokkan PERSIS oleh backend saat mencari dokumen yang wajib
 * diunggah (services.getRequiredConfigs: `transaction_type IN (?, 'ALL')` dan
 * `stage IN (?, 'ALL')`). Salah ketik satu huruf berarti konfigurasinya tidak
 * pernah terpakai — dan tidak ada error apa pun yang muncul. Karena itu
 * semuanya dipilih dari daftar, bukan diketik bebas.
 */

export const ATTACHMENT_ALL = "ALL"

export const attachmentTransactionTypes = [
  { id: "ALL", value: "ALL", label: "ALL — semua jenis transaksi" },
  { id: "procurement", value: "procurement", label: "Procurement" },
  { id: "mutation", value: "mutation", label: "Mutation" },
  { id: "disposal", value: "disposal", label: "Disposal" },
  { id: "stock_opname", value: "stock_opname", label: "Stock Opname" },
]

/**
 * Stage per jenis transaksi, disalin dari konstanta backend:
 * models/procurement_flow.go, mutation_flow.go, disposal_flow.go
 *
 * Catatan: EXECUTE_ASET memang tanpa huruf S kedua di backend — jangan
 * "dibetulkan" di sini, nilainya harus sama persis.
 */
export const attachmentStagesByType: Record<string, string[]> = {
  procurement: [
    "DRAFT",
    "ASSET_VERIFICATION",
    "APPROVAL",
    "PROCESS_BUDGET",
    "EXECUTE_ASET",
    "GR",
    "FINISHED",
    "REJECTED",
  ],
  mutation: [
    "DRAFT",
    "APPROVAL",
    "MUTATION_RECEIVING",
    "EXECUTE_MUTATION",
    "FINISHED",
    "REJECTED",
  ],
  disposal: [
    "DRAFT",
    "PURCHASING",
    "APPROVAL_REQUEST",
    "APPROVAL_AGREEMENT",
    "EXECUTE",
    "FINANCE",
    "TAX",
    "ASSET_DELETION",
    "FINISHED",
    "REJECTED",
    "CANCELLED",
  ],
  stock_opname: ["DRAFT", "APPROVAL", "FINISHED", "REJECTED"],
}

/** stage yang bisa dipilih untuk sebuah jenis transaksi, selalu diawali ALL */
export function attachmentStageOptions(transactionType: string) {
  const stages =
    transactionType && transactionType !== ATTACHMENT_ALL
      ? (attachmentStagesByType[transactionType] ?? [])
      : // kalau jenis transaksinya ALL, stage-nya ikut ALL saja —
        // stage milik satu alur tidak berlaku untuk alur lain
        []

  return [
    { id: ATTACHMENT_ALL, value: ATTACHMENT_ALL, label: "ALL — semua stage" },
    ...stages.map((stage) => ({ id: stage, value: stage, label: stage })),
  ]
}
