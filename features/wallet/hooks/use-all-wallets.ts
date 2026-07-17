import { useQuery } from '@tanstack/react-query';
import { AllWalletResponse } from '../type';
import { allWallets } from '../api/all-wallets';

export function useAllWallets() {
    return useQuery<AllWalletResponse, Error>({
        queryKey: ['wallets'],
        queryFn: allWallets
    });
}