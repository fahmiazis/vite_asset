import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast' 
import type { CreateFlowStepRequest } from '../../../models/approval/createStep'
import { createApprovalStep } from '../../../services/approval/createStep'
export function useCreateFlowStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFlowStepRequest) => createApprovalStep.create(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Flow step created successfully!')
      queryClient.invalidateQueries({ queryKey: ['approval-flow-detail'] })
      queryClient.invalidateQueries({ queryKey: ['flow-steps'] })
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create flow step'
      toast.error(errorMessage)
      console.error('Create flow step error:', error)
    },
  })
}