import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import type { UpdateFlowStepRequest } from '../../../models/approval/updateStep'
import { updateApprovalStep } from '../../../services/approval/updateStep'

export function useUpdateFlowStep(flowId: string) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ stepId, data }: { stepId: string; data: UpdateFlowStepRequest }) =>
      updateApprovalStep(stepId, data),
    onSuccess: (response) => {
      toast.success(response?.message || t('approvalDetail.toast.updateSuccess'))
      queryClient.invalidateQueries({ queryKey: ['approval-flow-detail', flowId] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('approvalDetail.toast.updateError'))
    },
  })
}
