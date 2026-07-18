import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTransaction } from '../api/update-transaction';
import { UpdateTransactionPayload } from '../type';

export function useUpdateTransaction(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTransactionPayload) => updateTransaction(id, data),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['wallets'] }),
                queryClient.invalidateQueries({ queryKey: ['transactions'] }),
                queryClient.invalidateQueries({ queryKey: ['transaction', id] })
            ]);
        },
    });
}
