import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTransferPayload, CreateTransactionResponse } from '../type';
import { createTransfer } from '../api/create-transfer';

export function useCreateTransfer() {
    const queryClient = useQueryClient();

    return useMutation<CreateTransactionResponse, Error, CreateTransferPayload>({
        mutationFn: createTransfer,
        onSuccess: () => {
            // Invalidate wallet and transactions queries to update balances and lists
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
}
