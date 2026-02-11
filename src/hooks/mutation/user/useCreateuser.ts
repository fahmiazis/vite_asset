// src/hooks/user/useUpdateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { UpdateUserRequest } from '../../../models/users/update';
import { updateUser } from '../../../services/users/update';
import { createUser } from '../../../services/users/create';

interface UseUpdateUserParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export function useCreateUser({
  onSuccess,
  onError,
  redirectOnSuccess = false,
  redirectPath = '/dashboard/user',
}: UseUpdateUserParams = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ payload }: { payload: UpdateUserRequest }) =>
      createUser( payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['create users'],
      });

      queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      toast.success(data.message || 'User updated successfully');

      if (redirectOnSuccess) {
        navigate(redirectPath);
      }

      onSuccess?.();
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create user';

      toast.error(errorMessage);

      onError?.(error);
    },
  });
}