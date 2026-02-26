import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { CreateAssetsCategoryPayload } from '../../../models/assetsCategory/create';
import { createAssetsCategory } from '../../../services/assetsCategory/create';

interface UseCreateAssetsCategoryParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export function useCreateAssetsCategory({
  onSuccess,
  onError,
  redirectOnSuccess = false,
  redirectPath = '/dashboard/assets-category',
}: UseCreateAssetsCategoryParams = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateAssetsCategoryPayload) => createAssetsCategory(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assets-category'] });
      toast.success(data.message || 'Asset category created successfully');

      if (redirectOnSuccess) {
        navigate(redirectPath);
      }

      onSuccess?.();
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create asset category';

      toast.error(errorMessage);
      onError?.(error);
    },
  });
}