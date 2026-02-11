// src/hooks/mutation/approval/useCreateApprovalFlow.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import type { CreateApprovalFlowRequest } from '../../../models/approval/create'
import { createApprovalFlow } from '../../../services/approval/create'

interface UseCreateApprovalFlowParams {
  onSuccess?: () => void
  onError?: (error: Error) => void
  redirectOnSuccess?: boolean
  redirectPath?: string
}

export function useCreateApprovalFlow({
  onSuccess,
  onError,
  redirectOnSuccess = false,
  redirectPath = '/dashboard/approval',
}: UseCreateApprovalFlowParams = {}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: CreateApprovalFlowRequest) => createApprovalFlow(payload),

    onSuccess: (data) => {
      // Invalidate approval list query
      queryClient.invalidateQueries({
        queryKey: ['approval-list'],
      })

      // Show success notification
      toast.success(data.message || 'Approval flow created successfully')

      // Redirect if needed
      if (redirectOnSuccess) {
        navigate(redirectPath)
      }

      // Custom success callback
      onSuccess?.()
    },

    onError: (error: any) => {
      // Show error notification
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create approval flow'

      toast.error(errorMessage)

      // Custom error callback
      onError?.(error)
    },
  })
}