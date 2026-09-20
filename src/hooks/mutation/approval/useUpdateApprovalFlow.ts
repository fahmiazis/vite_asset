import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import type { UpdateApprovalFlowRequest } from '../../../models/approval/update'
import { updateApprovalFlow } from '../../../services/approval/update'

export function useUpdateApprovalFlow(id: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: UpdateApprovalFlowRequest) => updateApprovalFlow(id, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['approval-flow-list'] })
      queryClient.invalidateQueries({ queryKey: ['approval-flow-detail', id] })
      toast.success(data?.message || t('approvalEdit.toast.success'))
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('approvalEdit.toast.error')
      )
    },
  })
}
