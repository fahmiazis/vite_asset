import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { deleteApprovalFlow } from '../../../services/approval/delete'

export function useDeleteApprovalFlow() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => deleteApprovalFlow(id),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['approval-flow-list'] })
      toast.success(data?.message || t('approvalList.deleteModal.success'))
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('approvalList.deleteModal.error')
      )
    },
  })
}
