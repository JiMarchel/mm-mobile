import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTransactionPayload, CreateTransactionResponse } from '../type';
import { createTransaction } from '../api/create-transaction';

export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation<CreateTransactionResponse, Error, CreateTransactionPayload>({
        mutationFn: createTransaction,
        onSuccess: () => {
            // Invalidate wallet queries to update balances
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
        },
    });
}
