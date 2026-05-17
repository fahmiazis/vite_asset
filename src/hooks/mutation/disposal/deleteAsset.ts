import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { removeAssetFromDisposal, type RemoveAssetFromDisposalRequest } from '../../../services/disposal/deleteAsset';

interface UseRemoveAssetFromDisposalParams {
  transactionNumber: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useRemoveAssetFromDisposal({
  transactionNumber,
  onSuccess,
  onError,
}: UseRemoveAssetFromDisposalParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveAssetFromDisposalRequest) =>
      removeAssetFromDisposal(transactionNumber, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["disposal-detail", transactionNumber],
      })

      toast.success(data.message || 'Aset berhasil dihapus dari disposal');

      onSuccess?.();
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Gagal menghapus aset dari disposal';

      toast.error(errorMessage);

      onError?.(error);
    },
  });
}