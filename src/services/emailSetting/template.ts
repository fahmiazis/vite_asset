import { axiosPrivate } from "../../libs/instance"
import type {
  EmailAction,
  EmailTransactionType,
  emailTemplateDetailProps,
  emailTemplateListProps,
} from "../../models/emailSetting/template"

export interface CreateEmailTemplatePayload {
  transaction_type: EmailTransactionType
  stage: string
  action: EmailAction
  subject: string
  body: string
  cc_role_ids: string[]
  is_active: boolean
}

/** jenis transaksi, stage, dan aksi adalah kunci template — tidak ikut diubah */
export interface UpdateEmailTemplatePayload {
  subject?: string
  body?: string
  cc_role_ids?: string[]
  is_active?: boolean
}

export const emailTemplateList = async (
  transactionType = ""
): Promise<emailTemplateListProps> => {
  const res = await axiosPrivate.get(`/email-templates`, {
    params: transactionType ? { transaction_type: transactionType } : undefined,
  })
  return res.data
}

export const emailTemplateDetail = async (
  id: number | string
): Promise<emailTemplateDetailProps> => {
  const res = await axiosPrivate.get(`/email-templates/${id}`)
  return res.data
}

export const createEmailTemplate = async (payload: CreateEmailTemplatePayload) => {
  const res = await axiosPrivate.post(`/email-templates`, payload)
  return res.data
}

export const updateEmailTemplate = async (
  id: number,
  payload: UpdateEmailTemplatePayload
) => {
  const res = await axiosPrivate.put(`/email-templates/${id}`, payload)
  return res.data
}

export const deleteEmailTemplate = async (id: number) => {
  const res = await axiosPrivate.delete(`/email-templates/${id}`)
  return res.data
}
