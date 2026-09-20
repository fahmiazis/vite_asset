import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { deleteApprovalStep } from '../../../services/approval/deleteStep'

export function useDeleteFlowStep(flowId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (stepId: string) => deleteApprovalStep(stepId),
    onSuccess: (response) => {
      toast.success(response?.message || t('approvalDetail.toast.deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: ['approval-flow-detail', flowId] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('approvalDetail.toast.deleteError'))
    },
  })
}
