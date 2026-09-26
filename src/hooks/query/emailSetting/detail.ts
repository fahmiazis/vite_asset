import { useQuery } from "@tanstack/react-query"
import type { emailTemplateDetailProps } from "../../../models/emailSetting/template"
import { emailTemplateDetail } from "../../../services/emailSetting/template"

export const useEmailTemplateDetail = (id: string | undefined) =>
  useQuery<emailTemplateDetailProps>({
    queryKey: ["email-template-detail", id],
    queryFn: () => emailTemplateDetail(id!),
    enabled: !!id,
  })
