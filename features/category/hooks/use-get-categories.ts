import { useQuery } from '@tanstack/react-query';
import { AllCategoriesResponse } from '../type';
import { getCategories } from '../api/get-categories';

export function useGetCategories() {
    return useQuery<AllCategoriesResponse, Error>({
        queryKey: ['categories'],
        queryFn: getCategories,
    });
}
