import type { EmailTransactionType } from "./emailSetting/template"

export interface waitingNotification {
  transaction_type: EmailTransactionType
  transaction_number: string
  current_stage: string
  created_by_name: string | null
  /** kapan pengajuan masuk ke stage/giliran saat ini */
  since: string
}

export interface waitingNotificationProps {
  data: {
    total: number
    items: waitingNotification[]
  }
  message: string
  status: string
}
