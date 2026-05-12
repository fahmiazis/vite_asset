import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { CreateDisposalRequest } from '../../../models/disposal/create';
import { createDisposal } from '../../../services/disposal/create';

interface UseCreateDisposalParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export function useCreateDisposal({
  onSuccess,
  onError,
  redirectOnSuccess = false,
  redirectPath = '/dashboard/disposal',
}: UseCreateDisposalParams = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateDisposalRequest) => createDisposal(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['disposals'],
      });

      toast.success(data.message || 'Disposal berhasil dibuat');

      if (redirectOnSuccess) {
        navigate(redirectPath);
      }

      onSuccess?.();
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Gagal membuat disposal aset';

      toast.error(errorMessage);

      onError?.(error);
    },
  });
}