import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { CreateMenuRequest } from '../../../models/menu/create';
import { createMenu } from '../../../services/menu/create';

interface UseCreateMenuParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export function useCreateMenu({
  onSuccess,
  onError,
  redirectOnSuccess = false,
  redirectPath = '/dashboard/menu',
}: UseCreateMenuParams = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateMenuRequest) => createMenu(payload),

    onSuccess: (data) => {
      // Invalidate menu list query
      queryClient.invalidateQueries({
        queryKey: ['menus'],
      });

      // Show success notification
      toast.success(data.message || 'Menu created successfully');
      navigate('/dashboard/menu');


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
        'Failed to create menu';

      toast.error(errorMessage);

      // Custom error callback
      onError?.(error);
    },
  });
}