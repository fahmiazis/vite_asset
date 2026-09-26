import type { EmailAction, EmailTransactionType } from "./template"

export interface emailRecipient {
  user_id?: string
  name: string
  email: string
}

/** isi dialog email sebelum aksi stage dijalankan */
export interface emailPreviewState {
  has_template: boolean
  template_id?: number
  transaction_number: string
  transaction_type: EmailTransactionType
  stage: string
  next_stage: string
  action: EmailAction
  subject: string
  body: string
  /** HTML email lengkap (layout, info ajuan, daftar aset) untuk pratinjau */
  html: string
  to: emailRecipient[]
  cc: emailRecipient[]
  mailer_configured: boolean
}

export type EmailLogStatus = "SENT" | "FAILED"

export interface emailLogState {
  id: number
  email_template_id: number | null
  transaction_number: string
  transaction_type: EmailTransactionType
  stage: string
  action: EmailAction
  subject: string
  to: string[]
  cc: string[]
  status: EmailLogStatus
  error_message: string | null
  attempts: number
  sent_by: string
  sent_by_name: string | null
  sent_at: string | null
  created_at: string
}

export interface emailLogListProps {
  data: emailLogState[]
  message: string
  status: string
}
