import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTransfer } from '../api/update-transfer';
import { UpdateTransferPayload } from '../type';

export function useUpdateTransfer(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTransferPayload) => updateTransfer(id, data),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['wallets'] }),
                queryClient.invalidateQueries({ queryKey: ['transactions'] }),
                queryClient.invalidateQueries({ queryKey: ['transaction', id] })
            ]);
        },
    });
}
