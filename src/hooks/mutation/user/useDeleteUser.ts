// src/hooks/mutation/user/useDeleteUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../services/users/delete';

interface UseDeleteUserParams {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    redirectOnSuccess?: boolean;
    redirectPath?: string;
}

export function useDeleteUser({
    onSuccess,
    onError,
    redirectOnSuccess = false,
    redirectPath = '/dashboard/users',
}: UseDeleteUserParams = {}) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (userId: string) => deleteUser(userId),

        onSuccess: (data) => {
            // Invalidate user list query
            queryClient.invalidateQueries({
                queryKey: ['user-list'],
            });

            // Invalidate specific user query
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });

            // Show success notification
            toast.success(data.message || 'User deleted successfully');

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
                'Failed to delete user';

            toast.error(errorMessage);

            // Custom error callback
            onError?.(error);
        },
    });
}