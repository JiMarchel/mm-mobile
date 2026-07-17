import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateWalletRequest, Wallet } from '../type';
import { createWallet } from '../api/create-wallet';
import { ApiSuccessResponse } from '@/infrastructure/api/types';

export function useCreateWallet() {
    const queryClient = useQueryClient();

    return useMutation<ApiSuccessResponse<Wallet>, Error, CreateWalletRequest>({
        mutationFn: createWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
        }
    });
}
