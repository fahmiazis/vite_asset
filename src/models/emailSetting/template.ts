export type EmailTransactionType = "procurement" | "mutation" | "disposal" | "disposal_agreement" | "handover"
export type EmailAction = "proceed" | "reject" | "revise" | "cancel"

export interface emailTemplateRole {
  id: string
  name: string
}

export interface emailTemplateState {
  id: number
  transaction_type: EmailTransactionType
  stage: string
  action: EmailAction
  subject: string
  body: string
  is_active: boolean
  cc_roles: emailTemplateRole[]
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface emailTemplateListProps {
  data: emailTemplateState[]
  message: string
  status: string
}

export interface emailTemplateDetailProps {
  data: emailTemplateState
  message: string
  status: string
}
