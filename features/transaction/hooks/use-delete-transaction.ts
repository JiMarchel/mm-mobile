import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction } from '../api/delete-transaction';

export function useDeleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTransaction(id),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['wallets'] }),
                queryClient.invalidateQueries({ queryKey: ['transactions'] })
            ]);
        },
    });
}
