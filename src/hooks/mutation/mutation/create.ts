import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { CreateMutationRequest } from '../../../models/mutation/create';
import { createMutation } from '../../../services/mutation/create';

interface UseCreateMutationParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export function useCreateMutation({
  onSuccess,
  onError,
  redirectOnSuccess = false,
  redirectPath = '/dashboard/transactions',
}: UseCreateMutationParams = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateMutationRequest) => createMutation(payload),

    onSuccess: (data) => {
      // Invalidate transaction list query
      queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });

      // Show success notification
      toast.success(data.message || 'Mutasi berhasil dibuat');

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
        'Gagal membuat mutasi';

      toast.error(errorMessage);

      // Custom error callback
      onError?.(error);
    },
  });
}