import { useQuery } from '@tanstack/react-query';
import { AllTransactionsResponse } from '../type';
import { getTransactions } from '../api/get-transactions';

export function useGetTransactions(startDate?: string, endDate?: string) {
    return useQuery<AllTransactionsResponse, Error>({
        queryKey: ['transactions', startDate, endDate],
        queryFn: () => getTransactions(startDate, endDate)
    });
}
