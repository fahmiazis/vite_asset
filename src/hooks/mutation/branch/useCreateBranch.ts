import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { CreateBranchRequest } from '../../../models/branch/create';
import { createBranch } from '../../../services/branch/create';

interface UseCreateBranchParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export function useCreateBranch({
  onSuccess,
  onError,
  redirectOnSuccess = false,
  redirectPath = '/dashboard/branch',
}: UseCreateBranchParams = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateBranchRequest) => createBranch(payload),

    onSuccess: (data) => {
      // Invalidate branch list query
      queryClient.invalidateQueries({
        queryKey: ['branches'],
      });

      // Show success notification
      toast.success(data.message || 'Branch created successfully');

      // Redirect if needed
      if (redirectOnSuccess) {
        navigate(redirectPath);
      }

      // Custom success callback
      onSuccess?.();
    },

    onError: (error: any) => {
      // Show error notification
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create branch';

      toast.error(errorMessage);

      // Custom error callback
      onError?.(error);
    },
  });
}