import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createEmailTemplate,
  deleteEmailTemplate,
  updateEmailTemplate,
  type CreateEmailTemplatePayload,
  type UpdateEmailTemplatePayload,
} from "../../../services/emailSetting/template"

export function useCreateEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEmailTemplatePayload) => createEmailTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-template-list"] })
    },
  })
}

export function useUpdateEmailTemplate(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateEmailTemplatePayload) => updateEmailTemplate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-template-list"] })
      queryClient.invalidateQueries({ queryKey: ["email-template-detail", String(id)] })
    },
  })
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEmailTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-template-list"] })
    },
  })
}
