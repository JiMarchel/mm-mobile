import { useQuery } from '@tanstack/react-query';
import { StatisticsData } from '../type';
import { getStatistics } from '../api/get-statistics';
import { ApiSuccessResponse } from '@/infrastructure/api/types';

export function useGetStatistics(startDate?: string, endDate?: string) {
    return useQuery<ApiSuccessResponse<StatisticsData>, Error>({
        queryKey: ['statistics', startDate, endDate],
        queryFn: () => getStatistics(startDate, endDate)
    });
}
