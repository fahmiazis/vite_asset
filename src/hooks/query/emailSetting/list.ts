import { useQuery } from "@tanstack/react-query"
import type { emailTemplateListProps } from "../../../models/emailSetting/template"
import { emailTemplateList } from "../../../services/emailSetting/template"

export const useEmailTemplateList = (transactionType = "") =>
  useQuery<emailTemplateListProps>({
    queryKey: ["email-template-list", transactionType],
    queryFn: () => emailTemplateList(transactionType),
  })
