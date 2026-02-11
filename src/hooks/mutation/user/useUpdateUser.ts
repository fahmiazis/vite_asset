// src/hooks/user/useUpdateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { UpdateUserRequest } from '../../../models/users/update';
import { updateUser } from '../../../services/users/update';

interface UseUpdateUserParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export function useUpdateUser({
  onSuccess,
  onError,
  redirectOnSuccess = false,
  redirectPath = '/dashboard/user',
}: UseUpdateUserParams = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserRequest }) =>
      updateUser(userId, payload),

    onSuccess: (data) => {
      // Invalidate user list query
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });

      // Invalidate specific user query
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      // Show success notification
      toast.success(data.message || 'User updated successfully');

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
        'Failed to update user';

      toast.error(errorMessage);

      // Custom error callback
      onError?.(error);
    },
  });
}