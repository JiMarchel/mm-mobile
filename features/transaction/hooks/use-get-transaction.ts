import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '../api/get-transaction';

export function useGetTransaction(id: string) {
    return useQuery({
        queryKey: ['transaction', id],
        queryFn: () => getTransaction(id),
        enabled: !!id,
    });
}
