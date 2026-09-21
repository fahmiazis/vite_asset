// src/hooks/user/useUpdateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { CreateUserRequest } from '../../../models/users/create';
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
    mutationFn: ({ payload }: { payload: CreateUserRequest }) =>
      createUser(payload),

    onSuccess: (data) => {
      // FIX: key-nya 'user-list' (lihat hooks/query/user/list.ts) — sebelumnya
      // meng-invalidate 'create users' yang tidak pernah dipakai query mana pun
      queryClient.invalidateQueries({ queryKey: ['user-list'] });

      toast.success(data.message || 'User berhasil dibuat');

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