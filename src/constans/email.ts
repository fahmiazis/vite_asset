import type { EmailAction, EmailTransactionType } from "../models/emailSetting/template"

/**
 * Pilihan untuk template email (email_templates).
 *
 * Stage di sini adalah stage ASAL — stage transaksi saat aksi dilakukan —
 * dan harus sama persis dengan emailTemplateStages di backend
 * (services/email_template_service.go), yang menolak nilai lain.
 *
 * Stage akhir tidak ada karena tidak punya aksi lanjutan. APPROVAL_AGREEMENT
 * milik transaksi disposal juga tidak: transaksinya maju lewat agreement
 * kolektif, yang punya jenis transaksinya sendiri (disposal_agreement) —
 * CREATE = saat agreement dibuat, APPROVAL_AGREEMENT = approve/tolak step-nya.
 */
export const emailTransactionTypes: { id: EmailTransactionType; value: EmailTransactionType; label: string }[] = [
  { id: "procurement", value: "procurement", label: "Procurement" },
  { id: "mutation", value: "mutation", label: "Mutation" },
  { id: "disposal", value: "disposal", label: "Disposal" },
  { id: "disposal_agreement", value: "disposal_agreement", label: "Disposal Agreement" },
  { id: "handover", value: "handover", label: "Asset Handover" },
  { id: "stock_opname", value: "stock_opname", label: "Stock Opname" },
]

export const emailStagesByType: Record<EmailTransactionType, string[]> = {
  procurement: ["DRAFT", "ASSET_VERIFICATION", "APPROVAL", "PROCESS_BUDGET", "EXECUTE_ASET", "GR"],
  mutation: ["DRAFT", "APPROVAL", "MUTATION_RECEIVING", "EXECUTE_MUTATION"],
  disposal: ["DRAFT", "PURCHASING", "APPROVAL_REQUEST", "EXECUTE", "FINANCE", "TAX", "ASSET_DELETION"],
  disposal_agreement: ["CREATE", "APPROVAL_AGREEMENT"],
  handover: ["DRAFT", "APPROVAL", "HANDOVER_RECEIVING"],
  stock_opname: ["DRAFT", "APPROVAL", "EXECUTE_STOCK_OPNAME"],
}

export const emailActions: EmailAction[] = ["proceed", "reject", "revise", "cancel"]

/**
 * aksi yang benar-benar ada per jenis transaksi — agreement tidak punya batal;
 * stock opname tidak punya batal, dan DRAFT hanya bisa disubmit. Revisi
 * (approver di APPROVAL, executor di EXECUTE_STOCK_OPNAME) dan tolak final
 * ada di branch module/stock-opname — backend email sudah menanganinya
 * secara generik (revise/reject → pembuat)
 */
export function emailActionsFor(transactionType: EmailTransactionType | "", stage: string): EmailAction[] {
  if (transactionType === "disposal_agreement") {
    return stage === "CREATE" ? ["proceed"] : ["proceed", "reject", "revise"]
  }
  if (transactionType === "stock_opname") {
    return stage === "DRAFT" ? ["proceed"] : ["proceed", "reject", "revise"]
  }
  return emailActions
}

/** placeholder yang diganti backend saat email dirender (renderEmailText) */
export const emailPlaceholders = [
  "transaction_number",
  "transaction_type",
  "stage",
  "next_stage",
  "action",
  "creator_name",
  "sender_name",
  "branch_code",
  "link",
  "date",
] as const
