import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { submitDisposal, type SubmitDisposalRequest } from '../../../services/disposal/submitDraft';

interface UseSubmitDisposalParams {
    transactionNumber: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useSubmitDisposal({
    transactionNumber,
    onSuccess,
    onError,
}: UseSubmitDisposalParams) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SubmitDisposalRequest) =>
            submitDisposal(transactionNumber, payload),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["disposal-detail", transactionNumber],
            })

            toast.success(data.message || 'Disposal berhasil disubmit');

            onSuccess?.();
        },

        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Gagal mengsubmit disposal';

            toast.error(errorMessage);

            onError?.(error);
        },
    });
}