import { axiosPrivate } from "../../libs/instance"
import type { EmailAction, EmailTransactionType } from "../../models/emailSetting/template"
import type {
  EmailLogStatus,
  emailLogListProps,
  emailLogState,
  emailPreviewState,
} from "../../models/emailSetting/transactionEmail"

export interface EmailPreviewParams {
  transactionType: EmailTransactionType
  /** kosong saat membuat agreement — nomornya belum ada */
  transactionNumber: string
  action: EmailAction
  /** transaksi anggota agreement yang akan dibuat */
  memberNumbers?: string[]
}

export const getEmailPreview = async ({
  transactionType,
  transactionNumber,
  action,
  memberNumbers,
}: EmailPreviewParams): Promise<emailPreviewState> => {
  const res = await axiosPrivate.get(`/transaction-emails/preview`, {
    params: {
      transaction_type: transactionType,
      transaction_number: transactionNumber || undefined,
      action,
      member_numbers: memberNumbers?.length ? memberNumbers.join(",") : undefined,
    },
  })
  return res.data.data
}

export interface SendTransactionEmailPayload {
  transaction_type: EmailTransactionType
  transaction_number: string
  template_id: number
  to: string[]
  cc: string[]
  additional_message: string
}

/**
 * Dipanggil SETELAH aksi stage berhasil. Subject tidak dikirim — server
 * selalu merendernya ulang dari template. Gagal SMTP tetap dibalas 200 dengan
 * status FAILED (log-nya tersimpan untuk dikirim ulang).
 */
export const sendTransactionEmail = async (
  payload: SendTransactionEmailPayload
): Promise<emailLogState> => {
  const res = await axiosPrivate.post(`/transaction-emails/send`, payload)
  return res.data.data
}

export const resendTransactionEmail = async (logId: number): Promise<emailLogState> => {
  const res = await axiosPrivate.post(`/transaction-emails/logs/${logId}/resend`)
  return res.data.data
}

export interface EmailLogFilter {
  status?: EmailLogStatus | ""
  transactionNumber?: string
}

export const emailLogList = async ({
  status,
  transactionNumber,
}: EmailLogFilter): Promise<emailLogListProps> => {
  const res = await axiosPrivate.get(`/transaction-emails/logs`, {
    params: {
      status: status || undefined,
      transaction_number: transactionNumber || undefined,
    },
  })
  return res.data
}
