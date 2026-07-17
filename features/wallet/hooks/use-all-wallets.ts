import { useMutation } from '@tanstack/react-query';
import { AllWalletResponse } from '../type.js';
import { allWallets } from '../api/all-wallets.js';

export function useAllWallets() {
    return useMutation<AllWalletResponse, Error>({
        mutationFn: allWallets
    })
}