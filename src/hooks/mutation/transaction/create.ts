import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { ProcurementPayload } from '../../../models/transaction/create';
import { createProcurement } from '../../../services/transaction/create';

interface UseCreateProcurementParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export function useCreateProcurement({
  onSuccess,
  onError,
  redirectOnSuccess = false,
  redirectPath = '/dashboard/procurement',
}: UseCreateProcurementParams = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ProcurementPayload) => createProcurement(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['procurements'],
      });

      toast.success(data.message || 'Procurement berhasil dibuat');

      if (redirectOnSuccess) {
        navigate(redirectPath);
      }

      onSuccess?.();
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Gagal membuat procurement';

      toast.error(errorMessage);

      onError?.(error);
    },
  });
}